import React, { useRef, useState, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import {
  type AdminTabId,
  ADMIN_TAB_LABELS,
  saveAdminTabOrder,
} from './adminTabs';

interface AdminTabBarProps {
  tabOrder: AdminTabId[];
  activeTab: AdminTabId;
  onTabOrderChange: (order: AdminTabId[]) => void;
  onActiveTabChange: (tab: AdminTabId) => void;
}

const AdminTabBar: React.FC<AdminTabBarProps> = ({
  tabOrder,
  activeTab,
  onTabOrderChange,
  onActiveTabChange,
}) => {
  const tabRefs = useRef<Map<AdminTabId, HTMLDivElement>>(new Map());
  const [draggingId, setDraggingId] = useState<AdminTabId | null>(null);
  const [dropTargetId, setDropTargetId] = useState<AdminTabId | null>(null);

  const reorderTabs = useCallback(
    (fromId: AdminTabId, toId: AdminTabId) => {
      if (fromId === toId) return;
      const fromIndex = tabOrder.indexOf(fromId);
      const toIndex = tabOrder.indexOf(toId);
      if (fromIndex < 0 || toIndex < 0) return;

      const next = [...tabOrder];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, fromId);
      onTabOrderChange(next);
      saveAdminTabOrder(next);
    },
    [tabOrder, onTabOrderChange]
  );

  const getDropTarget = useCallback(
    (clientX: number): AdminTabId | null => {
      for (const id of tabOrder) {
        const el = tabRefs.current.get(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right) {
          return id;
        }
      }
      return null;
    },
    [tabOrder]
  );

  const handleGripPointerDown = (
    e: React.PointerEvent,
    tabId: AdminTabId
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(tabId);
    setDropTargetId(tabId);
  };

  const handleGripPointerMove = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    const target = getDropTarget(e.clientX);
    if (target) setDropTargetId(target);
  };

  const handleGripPointerUp = (e: React.PointerEvent) => {
    if (draggingId !== null && dropTargetId !== null) {
      reorderTabs(draggingId, dropTargetId);
    }
    setDraggingId(null);
    setDropTargetId(null);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <div className="mb-6 border-b border-darkGrey/50">
      <p className="text-[10px] font-ptMono text-gunSmoke/70 mb-2 sm:hidden">
        Scroll tabs · drag grip to reorder
      </p>
      <div
        className="-mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto overscroll-x-contain
          [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1
          [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gunSmoke/40"
      >
        <div className="flex flex-nowrap gap-0.5 sm:gap-1 min-w-min pb-px">
          {tabOrder.map((tabId) => {
            const isActive = activeTab === tabId;
            const isDragging = draggingId === tabId;
            const isDropTarget =
              dropTargetId === tabId && draggingId !== null && draggingId !== tabId;

            return (
              <div
                key={tabId}
                ref={(el) => {
                  if (el) tabRefs.current.set(tabId, el);
                  else tabRefs.current.delete(tabId);
                }}
                className={`flex items-stretch shrink-0 rounded-t-sm transition-colors ${
                  isDropTarget ? 'bg-accent-light/5' : ''
                } ${isDragging ? 'opacity-60' : ''}`}
              >
                <button
                  type="button"
                  aria-label={`Reorder ${ADMIN_TAB_LABELS[tabId]} tab`}
                  className="flex items-center px-1 sm:px-1.5 text-gunSmoke/50 hover:text-gunSmoke
                    cursor-grab active:cursor-grabbing touch-none select-none"
                  onPointerDown={(e) => handleGripPointerDown(e, tabId)}
                  onPointerMove={handleGripPointerMove}
                  onPointerUp={handleGripPointerUp}
                  onPointerCancel={handleGripPointerUp}
                >
                  <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onActiveTabChange(tabId)}
                  className={`px-2 sm:px-4 py-2 font-ptMono text-xs sm:text-sm whitespace-nowrap
                    transition-colors border-b-2 -mb-px ${
                    isActive
                      ? 'text-accent-light border-accent-light'
                      : 'text-gunSmoke hover:text-quillGray border-transparent'
                  }`}
                >
                  {ADMIN_TAB_LABELS[tabId]}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminTabBar;
