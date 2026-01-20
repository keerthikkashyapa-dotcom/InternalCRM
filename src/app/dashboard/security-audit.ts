'use server'

import { createAdminClient } from '@/utils/supabase/server'

export async function runSecurityAudit() {
    try {
        const adminClient = await createAdminClient()
        
        // Check RLS policies for all tables
        const tables = ['profiles', 'workspaces', 'customers', 'deals', 'tasks', 'activity_logs']
        const auditResults: Array<{
            table: string;
            rlsEnabled: boolean;
            policyCount: number;
            status: 'PASS' | 'FAIL' | 'ERROR';
            issues: string[];
            error?: string;
        }> = []

        for (const table of tables) {
            try {
                // Check if RLS is enabled
                const { data: rlsEnabled, error: rlsError } = await adminClient
                    .rpc('check_rls_enabled', { table_name: table })
                
                // Get policy count
                const { count: policyCount, error: policyError } = await adminClient
                    .from('pg_policy')
                    .select('*', { count: 'exact', head: true })
                    .eq('polrelid', `(SELECT oid FROM pg_class WHERE relname = '${table}')`)
                
                auditResults.push({
                    table,
                    rlsEnabled: rlsEnabled === true,
                    policyCount: policyCount || 0,
                    status: rlsEnabled === true && (policyCount || 0) > 0 ? 'PASS' : 'FAIL',
                    issues: []
                })
                
                // Check for common security issues
                if (rlsEnabled !== true) {
                    auditResults[auditResults.length - 1].issues.push('RLS not enabled')
                }
                if ((policyCount || 0) === 0) {
                    auditResults[auditResults.length - 1].issues.push('No policies defined')
                }
                
            } catch (error) {
                auditResults.push({
                    table,
                    rlsEnabled: false,
                    policyCount: 0,
                    status: 'ERROR',
                    issues: [error instanceof Error ? error.message : 'Unknown error'],
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        // Check for orphaned records
        const orphanChecks = await checkOrphanedRecords(adminClient)
        
        // Check for overly permissive policies
        const policyChecks = await checkPermissivePolicies(adminClient)

        return {
            success: true,
            timestamp: new Date().toISOString(),
            tableAudits: auditResults,
            orphanedRecords: orphanChecks,
            permissivePolicies: policyChecks,
            summary: {
                totalTables: tables.length,
                passed: auditResults.filter(r => r.status === 'PASS').length,
                failed: auditResults.filter(r => r.status === 'FAIL').length,
                errors: auditResults.filter(r => r.status === 'ERROR').length
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Security audit failed',
            timestamp: new Date().toISOString()
        }
    }
}

async function checkOrphanedRecords(adminClient: any) {
    const checks = []
    
    try {
        // Check for profiles without workspaces
        const { count: orphanedProfiles } = await adminClient
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .is('workspace_id', null)
        
        checks.push({
            check: 'Profiles without workspace',
            count: orphanedProfiles || 0,
            severity: orphanedProfiles && orphanedProfiles > 0 ? 'WARNING' : 'OK'
        })
        
        // Check for customers without workspaces
        const { count: orphanedCustomers } = await adminClient
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .is('workspace_id', null)
            
        checks.push({
            check: 'Customers without workspace',
            count: orphanedCustomers || 0,
            severity: orphanedCustomers && orphanedCustomers > 0 ? 'CRITICAL' : 'OK'
        })
        
        // Check for deals without workspaces
        const { count: orphanedDeals } = await adminClient
            .from('deals')
            .select('*', { count: 'exact', head: true })
            .is('workspace_id', null)
            
        checks.push({
            check: 'Deals without workspace',
            count: orphanedDeals || 0,
            severity: orphanedDeals && orphanedDeals > 0 ? 'CRITICAL' : 'OK'
        })
        
    } catch (error) {
        checks.push({
            check: 'Orphan check failed',
            count: 0,
            severity: 'ERROR',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
    
    return checks
}

async function checkPermissivePolicies(adminClient: any) {
    const checks = []
    
    try {
        // This would require checking actual policy definitions
        // For now, we'll add a placeholder
        checks.push({
            check: 'Policy permissiveness check',
            status: 'NOT_IMPLEMENTED',
            note: 'Manual review of policy definitions required'
        })
        
    } catch (error) {
        checks.push({
            check: 'Policy check failed',
            status: 'ERROR',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
    
    return checks
}