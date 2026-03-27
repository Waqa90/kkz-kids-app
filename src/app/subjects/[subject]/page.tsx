import SubjectContent from './components/SubjectContent';

interface PageProps {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ child?: string; class?: string }>;
}

export default async function SubjectPage({ params, searchParams }: PageProps) {
  const { subject } = await params;
  const { child, class: classOverride } = await searchParams;
  return <SubjectContent subject={subject} child={child} classOverride={classOverride} />;
}
