import Link from "next/link";
import type { CategoryFaqItem } from "@/lib/courses/category-faq";

/** Category FAQ — same look as the course page's FaqSection, but answers can carry internal links. */
export function CategoryFaqSection({ items }: { items: CategoryFaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="preguntas" className="flex max-w-2xl flex-col gap-3">
      <h2 id="preguntas" className="scroll-mt-24 font-serif text-2xl text-ink">
        Preguntas frecuentes
      </h2>
      <div className="flex flex-col divide-y divide-rule border-y border-rule">
        {items.map((item) => (
          <details key={item.question} className="group py-3">
            <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
              <span className="mr-2 inline-block font-mono text-stamp-red transition-transform group-open:rotate-45">+</span>
              {item.question}
            </summary>
            <p className="mt-2 pl-6 text-ink-muted">
              {item.answer.map((segment, index) =>
                typeof segment === "string" ? (
                  segment
                ) : (
                  <Link
                    key={`${index}-${segment.href}`}
                    href={segment.href}
                    className="text-ink underline underline-offset-4 hover:text-stamp-red"
                  >
                    {segment.label}
                  </Link>
                )
              )}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
