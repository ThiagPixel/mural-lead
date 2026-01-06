import AuthorizedAccess from "@/components/permissions";

export default async function AuthorizedPage() {
  return (
    <div className="p-6">
      <AuthorizedAccess/>
    </div>
  );
}
