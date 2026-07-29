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
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Team</p>
          <h2 className="app__admin-groceriesTitle">Shoppers roster</h2>
          <p>Everyone with shopper access, and how much work is on their plate this week.</p>
        </div>
      </section>

      <section className="app__admin-groceriesPanel">
        <form className="app__admin-groceriesSearch" action={`/dashboard/${params.role}/shoppers`}>
          <label className="app__admin-field">
            <span>Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Name or email..."
              className="app__admin-input"
            />
          </label>
          <div className="app__admin-field">
            <span>Total shoppers</span>
            <input className="app__admin-input" value={`${response.total}`} readOnly />
          </div>
          <button type="submit" className="app__admin-filterButton">
            Search
          </button>
        </form>
      </section>

      {response.items.length === 0 ? (
        <section className="app__admin-emptyState">
          <p className="app__admin-eyebrow">No shoppers</p>
          <h2>No shoppers match this search</h2>
        </section>
      ) : (
        <section className="app__admin-productSection">
          <div className="app__admin-dataList">
            {response.items.map((shopper) => (
              <article key={shopper.id} className="app__admin-dataRow">
                <div className="app__admin-stack">
                  <strong>{shopper.name}</strong>
                  <span>{shopper.email}</span>
                </div>

                <div className="app__admin-dataStats">
                  <span>Active orders: {formatNumber(shopper.active_count)}</span>
                  <span>Completed this week: {formatNumber(shopper.completed_this_week)}</span>
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
