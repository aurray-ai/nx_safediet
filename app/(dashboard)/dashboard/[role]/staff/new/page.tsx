import type { Route } from "next";
import Link from "next/link";

import { CreateStaffForm } from "@/components/dashboard/create-staff-form";

export default function NewStaffPage({ params }: { params: { role: string } }) {
  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Staff</p>
          <h2 className="app__admin-groceriesTitle">Add staff</h2>
          <p>Create an account and send an email invite so they can set their own password.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/staff` as Route} className="app__admin-secondaryButton">
            Back to staff
          </Link>
        </div>
      </section>

      <section className="app__admin-productSection">
        <CreateStaffForm role={params.role} />
      </section>
    </section>
  );
}
