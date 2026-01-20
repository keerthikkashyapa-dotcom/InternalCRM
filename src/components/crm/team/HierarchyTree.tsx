'use client'

import React, { useState, ReactElement } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Users, Shield, User, Mail, Briefcase, CheckSquare } from 'lucide-react'

interface TreeNode {
  id: string
  full_name: string
  email: string
  role: string
  manager_id: string | null
  children: TreeNode[]
  deals_count: number
  tasks_count: number
}

interface HierarchyTreeProps {
  team: any[]
  onMemberClick?: (member: any) => void
}

export function HierarchyTree({ team, onMemberClick }: HierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build hierarchy tree from flat team data
  const buildHierarchy = (): TreeNode[] => {
    if (!team || team.length === 0) return []

    // Create a map of all members
    const memberMap = new Map<string, TreeNode>()
    team.forEach(member => {
      memberMap.set(member.id, {
        id: member.id,
        full_name: member.full_name,
        email: member.email,
        role: member.role,
        manager_id: member.manager_id,
        children: [],
        deals_count: member.deals?.[0]?.count || 0,
        tasks_count: member.tasks?.[0]?.count || 0
      })
    })

    // Build the tree structure
    const roots: TreeNode[] = []
    memberMap.forEach(node => {
      if (!node.manager_id) {
        // Root level (Admins)
        roots.push(node)
      } else {
        // Add as child to manager
        const manager = memberMap.get(node.manager_id)
        if (manager) {
          manager.children.push(node)
        }
      }
    })

    return roots
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderTreeNode = (node: TreeNode, level: number = 0): ReactElement => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0
    
    return (
      <div key={node.id} className="ml-6">
        {/* Node Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-white/50 ${
            level === 0 
              ? 'bg-red-50 border-red-100' 
              : level === 1 
                ? 'bg-orange-50 border-orange-100' 
                : 'bg-green-50 border-green-100'
          }`}
          onClick={() => onMemberClick && onMemberClick(team.find(m => m.id === node.id))}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.id)
              }}
              className="p-1 hover:bg-white/50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          
          {/* Role Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            node.role === 'admin' 
              ? 'bg-red-500/10 text-red-600' 
              : node.role === 'manager'
                ? 'bg-orange-500/10 text-orange-600'
                : 'bg-green-500/10 text-green-600'
          }`}>
            {node.role === 'admin' ? (
              <Shield className="w-5 h-5" />
            ) : node.role === 'manager' ? (
              <Users className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          
          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[#0F172A] truncate">{node.full_name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                node.role === 'admin' 
                  ? 'bg-red-500/10 text-red-600' 
                  : node.role === 'manager'
                    ? 'bg-orange-500/10 text-orange-600'
                    : 'bg-green-500/10 text-green-600'
              }`}>
                {node.role === 'admin' ? 'Admin' : node.role === 'manager' ? 'Manager' : 'Team Member'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{node.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Briefcase className="w-3 h-3" />
                  <span>{node.deals_count} deals</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-600">
                  <CheckSquare className="w-3 h-3" />
                  <span>{node.tasks_count} tasks</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Direct Reports Count */}
          {hasChildren && (
            <div className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
              {node.children.length} {node.children.length === 1 ? 'report' : 'reports'}
            </div>
          )}
        </motion.div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-l-2 border-gray-200 ml-5 pl-5 py-2 space-y-2">
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const hierarchy = buildHierarchy()

  if (hierarchy.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-[3rem] border border-primary/5 opacity-30">
        <Users className="w-12 h-12 mx-auto mb-4" />
        <p className="font-black uppercase tracking-widest">No team hierarchy found</p>
        <p className="text-sm text-gray-500 mt-2">Add team members to build your organization structure</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-[#0F172A]">Organization Hierarchy</h3>
          <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">
            Click on members to view details • {team.length} total members
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-bold text-red-600">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="font-bold text-orange-600">Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-bold text-green-600">Team Member</span>
          </div>
        </div>
      </div>
      
      <div className="glass bg-white/30 rounded-[3rem] p-8 border border-primary/5">
        {hierarchy.map(root => renderTreeNode(root))}
      </div>
    </div>
  )
}