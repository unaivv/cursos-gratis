/** Renders a JSON-LD `<script>` block. Content is always our own DB data
 * (never raw user input), but the `<` escape is kept as a defensive habit
 * against a stray "</script>" inside a title breaking the page. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
