import type { Route } from "next";
import Link from "next/link";

import { StaffDetailsForm } from "@/components/dashboard/staff-details-form";
import { fetchAdminStaff } from "@/lib/api";
import { formatDate, formatLabel } from "@/lib/admin-format";

const ROLE_FILTERS = ["chef", "shopper", "platform_user", "customer"];

export default async function StaffManagementPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string; role?: string; page?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const roleFilter = searchParams?.role || "";
  const rawPage = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = 20;
  const response = await fetchAdminStaff({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    pageSize,
  });
  const totalPages = Math.max(1, Math.ceil(response.total / pageSize));

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (roleFilter) query.set("role", roleFilter);
    query.set("page", String(targetPage));
    return `/dashboard/${params.role}/staff?${query.toString()}` as Route;
  };

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Team</p>
          <h2 className="app__admin-groceriesTitle">Staff management</h2>
          <p>Find any account and grant or revoke chef and shopper access.</p>
        </div>

        <div className="app__admin-groceriesActions">
          <Link href={`/dashboard/${params.role}/staff/new` as Route} className="app__admin-primaryButton">
            Add staff
          </Link>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${params.role}/staff`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Name or email..."
              className="app__admin-input"
            />
          </label>
          <label className="app__admin-field">
            <span>Role</span>
            <select name="role" defaultValue={roleFilter} className="app__admin-input">
              <option value="">All roles</option>
              {ROLE_FILTERS.map((role) => (
                <option key={role} value={role}>
                  {formatLabel(role)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="app__admin-filterButton">
            Filter
          </button>
        </form>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No accounts</p>
          <h2>No accounts match this filter</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((staffUser) => (
              <article key={staffUser.id} className="app__admin-dataRow app__admin-dataRow--stacked">
                <div className="app__admin-stack">
                  <strong>{staffUser.name}</strong>
                  <span>{staffUser.email}</span>
                  <div className="app__admin-tagRow">
                    {staffUser.user_types.map((userType) => (
                      <span key={userType} className="app__admin-categoryPill">
                        {formatLabel(userType)}
                      </span>
                    ))}
                    <span className="app__admin-tagPill">
                      {staffUser.staff_type ? formatLabel(staffUser.staff_type) : "Not specified"}
                    </span>
                  </div>
                  <span className="app__admin-inlineMeta">Joined {formatDate(staffUser.created_at)}</span>
                </div>

                <StaffDetailsForm
                  userId={staffUser.id}
                  userTypes={staffUser.user_types}
                  staffType={staffUser.staff_type}
                />
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <section className="app__admin-pagination">
              <span className="app__admin-inlineMeta">
                Page {page} of {totalPages}
              </span>
              <div className="app__admin-paginationActions">
                {page > 1 ? (
                  <Link href={buildPageHref(page - 1)} className="app__admin-secondaryButton">
                    Previous
                  </Link>
                ) : (
                  <span className="app__admin-secondaryButton app__admin-paginationButton is-disabled">Previous</span>
                )}
                {page < totalPages ? (
                  <Link href={buildPageHref(page + 1)} className="app__admin-primaryButton">
                    Next
                  </Link>
                ) : (
                  <span className="app__admin-primaryButton app__admin-paginationButton is-disabled">Next</span>
                )}
              </div>
            </section>
          ) : null}
        </section>
      )}
    </section>
  );
}
