import Link from "next/link";
import { readCategories } from "@/lib/courses/read";
import { createCourse } from "../../actions";
import { CourseForm } from "../CourseForm";

export default async function NewCoursePage() {
  const categories = await readCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="font-mono text-xs text-ink-muted hover:text-ink">
        ← volver
      </Link>
      <h1 className="font-serif text-2xl text-ink">Nuevo curso</h1>
      <CourseForm action={createCourse} categories={categories} submitLabel="Crear curso" />
    </div>
  );
}
