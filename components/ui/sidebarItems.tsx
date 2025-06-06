import React from "react";

interface SidebarItemsProps {
  items: { id: string; title: string; dateLabel?: string }[];
}

export function SidebarItems({ items }: SidebarItemsProps) {
  let lastDateLabel: string | undefined = undefined;
  return (
    <div className="flex flex-col gap-2 mt-4">
      {items.map((item, idx) => (
        <React.Fragment key={item.id}>
          {item.dateLabel && item.dateLabel !== lastDateLabel && (
            <div className="text-xs text-gray-400 font-medium mb-1 mt-2">
              {item.dateLabel}
            </div>
          )}
          <div className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-sky-600 transition">
            {item.title}
          </div>
          {item.dateLabel && (lastDateLabel = item.dateLabel)}
        </React.Fragment>
      ))}
    </div>
  );
}
