import { formatDate, formatDistance, parseISO } from "date-fns";
import type { ChangelogItem } from "../types";

export function ChangelogSection({ items }: { items: ChangelogItem[] }) {
  return (
    <section id="changelog">
      <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-4 text-left">
        {items?.map((item, i) => (
          <div key={i} className="rounded-xl bg-card/50 p-6">
            <small
              className="inline-block rounded-full border border-highlight/50 px-2 py-0.5 text-xs font-semibold text-highlight"
              title={formatDate(parseISO(item.date), "yyyy-MM-dd")}
            >
              {formatDistance(parseISO(item.date), new Date(), {
                addSuffix: true,
              })}
            </small>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {item.changes.map((change, j) => (
                <li key={j}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
