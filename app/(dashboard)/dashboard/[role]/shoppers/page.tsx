import type { Route } from "next";
import Link from "next/link";

import { fetchAdminShopperRoster } from "@/lib/api";
import { formatNumber } from "@/lib/admin-format";

export default async function ShoppersRosterPage({
  params,
  searchParams,
}: {
  params: { role: string };
  searchParams?: { search?: string; page?: string };
}) {
  const search = searchParams?.search?.trim() || "";
  const rawPage = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = 20;
  const response = await fetchAdminShopperRoster({ search: search || undefined, page, pageSize });
  const totalPages = Math.max(1, Math.ceil(response.total / pageSize));

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    query.set("page", String(targetPage));
    return `/dashboard/${params.role}/shoppers?${query.toString()}` as Route;
  };

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader app__admin-groceriesHeader--compact">
        <div className="app__admin-teamHeaderCopy">
          <p className="app__admin-eyebrow">Team</p>
          <h2 className="app__admin-groceriesTitle">Shoppers</h2>
        </div>

        <div className="app__admin-groceriesActions app__admin-groceriesActions--compact">
          <span className="app__admin-inlineMeta">{formatNumber(response.total)} shoppers</span>
        </div>
      </section>

      <section className="app__admin-groceriesPanel app__admin-groceriesPanel--compact">
        <form className="app__admin-teamToolbar" action={`/dashboard/${params.role}/shoppers`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Name or email..."
              className="app__admin-input"
            />
          </label>
          <button type="submit" className="app__admin-filterButton">
            Search
          </button>
        </form>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No shoppers</p>
          <h2>No shoppers found</h2>
        </section>
      ) : (
        <section className="app__admin-productSection app__admin-productSection--compact">
          <div className="app__admin-teamList">
            {response.items.map((shopper) => (
              <article key={shopper.id} className="app__admin-teamRow">
                <div className="app__admin-teamIdentity">
                  <div className="app__admin-teamAvatar">{shopper.name.slice(0, 2).toUpperCase()}</div>
                  <div className="app__admin-teamNameBlock">
                    <div className="app__admin-teamTop">
                      <strong>{shopper.name}</strong>
                      <span className="app__admin-categoryPill">Shopper</span>
                    </div>
                    <span>{shopper.email}</span>
                  </div>
                </div>

                <div className="app__admin-teamMetrics">
                  <div className="app__admin-teamMetric">
                    <span>Active</span>
                    <strong>{formatNumber(shopper.active_count)}</strong>
                  </div>
                  <div className="app__admin-teamMetric">
                    <span>Completed</span>
                    <strong>{formatNumber(shopper.completed_this_week)}</strong>
                  </div>
                </div>
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
