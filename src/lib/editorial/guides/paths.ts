import { OTHER_PATHS } from "./paths-other";
import { TECH_PATHS } from "./paths-tech";
import { AI_PROGRAMMING_PATH, TOPIC_PATHS } from "./paths-topics";

/**
 * Every learning-path guide. Order matters: the footer lists the first
 * eight, and a category's main guide is its first own path — so the
 * programming-with-AI path (the most searched topic) sits right after the
 * tech paths, never before ruta-desarrollo-frontend.
 */
export const PATH_GUIDES = [...TECH_PATHS, AI_PROGRAMMING_PATH, ...OTHER_PATHS, ...TOPIC_PATHS];
