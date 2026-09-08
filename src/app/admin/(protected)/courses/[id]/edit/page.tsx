import Link from "next/link";
import { notFound } from "next/navigation";
import { readCategories } from "@/lib/courses/read";
import { getCourseById } from "@/lib/db/admin-queries";
import { updateCourse } from "../../../actions";
import { CourseForm } from "../../CourseForm";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, course] = await Promise.all([readCategories(), getCourseById(id)]);
  if (!course) notFound();

  const boundUpdate = updateCourse.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="font-mono text-xs text-ink-muted hover:text-ink">
        ← volver
      </Link>
      <h1 className="font-serif text-2xl text-ink">Editar curso</h1>
      <CourseForm
        action={boundUpdate}
        categories={categories}
        submitLabel="Guardar cambios"
        defaultValues={{
          slug: course.slug,
          title: course.title,
          author: course.author ?? undefined,
          platform: course.platform,
          category: course.category,
          sourceUrl: course.sourceUrl,
          status: course.status,
          lastVerifiedAt: course.lastVerifiedAt,
          youtubeVideoId: course.youtubeVideoId ?? undefined,
          youtubePlaylistId: course.youtubePlaylistId ?? undefined,
          youtubeChannelId: course.youtubeChannelId ?? undefined,
        }}
      />
    </div>
  );
}
