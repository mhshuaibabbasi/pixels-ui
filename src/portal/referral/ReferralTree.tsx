import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronDown, User as UserIcon } from "lucide-react";

export interface TreeNode {
  user_id: number;
  name: string;
  email?: string;
  joined?: string;
  invested?: number;
  children?: TreeNode[];
}

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const ReferralTree = ({ node, depth = 0, isRoot = false }: { node: TreeNode; depth?: number; isRoot?: boolean }) => {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!node.children?.length;

  return (
    <div className={depth > 0 ? "ml-4 sm:ml-6 border-l border-white/10 pl-3 sm:pl-4" : ""}>
      <div
        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1.5 transition-colors ${
          isRoot ? "bg-primary/10 border border-primary/20" : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
        }`}
      >
        <button
          onClick={() => hasChildren && setOpen((v) => !v)}
          className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-lg ${hasChildren ? "text-gray-300 hover:bg-white/10" : "text-transparent"}`}
        >
          {hasChildren ? (open ? <ChevronDown size={15} /> : <ChevronRight size={15} />) : <span className="w-2 h-2" />}
        </button>

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isRoot ? "bg-gradient-to-br from-primary to-brand-accent" : "bg-white/[0.06]"}`}>
          <UserIcon size={15} className={isRoot ? "text-white" : "text-gray-300"} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">
            {node.name} {isRoot && <span className="text-xs text-primary font-normal">(You)</span>}
          </p>
          {node.email && <p className="text-xs text-gray-500 truncate">{node.email}</p>}
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-emerald-400">{fmt(node.invested)} USDT</p>
          <p className="text-[11px] text-gray-500">{hasChildren ? `${node.children!.length} direct` : "no referrals"}</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <ReferralTree key={child.user_id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralTree;
