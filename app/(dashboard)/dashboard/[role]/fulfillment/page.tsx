import type { Route } from "next";
import Link from "next/link";

import { FulfillmentOverviewRefresher } from "@/components/dashboard/fulfillment-overview-refresher";
import { fetchAdminFulfillmentOverview } from "@/lib/api";
import { formatNumber } from "@/lib/admin-format";

export default async function FulfillmentOverviewPage({ params }: { params: { role: string } }) {
  const overview = await fetchAdminFulfillmentOverview();
  const totalUnassigned = overview.chef.unassigned + overview.shopper.unassigned;
  const totalInProgress = overview.chef.in_progress + overview.shopper.in_progress;

  return (
    <section className="app__admin-groceries">
      <FulfillmentOverviewRefresher />

      <header className="app__admin-hero">
        <div className="app__admin-heroCopy">
          <p className="app__admin-eyebrow">Operations</p>
          <h1 className="app__admin-title">Fulfillment overview</h1>
          <p className="app__admin-copy">
            A live cross-track view of both the meal-prep and grocery-shopping queues, updating in real time as
            orders are assigned and declined.
          </p>
        </div>

        <div className="app__admin-heroStats">
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">Unassigned (both tracks)</span>
            <strong>{formatNumber(totalUnassigned)}</strong>
          </article>
          <article className="app__admin-statCard">
            <span className="app__admin-userLabel">In progress (both tracks)</span>
            <strong>{formatNumber(totalInProgress)}</strong>
          </article>
        </div>
      </header>

      <section className="app__admin-summaryGrid">
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Chef track</p>
          <h2>{formatNumber(overview.chef.unassigned)}</h2>
          <p>Meal orders waiting for a chef.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Chef track</p>
          <h2>{formatNumber(overview.chef.in_progress)}</h2>
          <p>Meal orders currently assigned or preparing.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Shopper track</p>
          <h2>{formatNumber(overview.shopper.unassigned)}</h2>
          <p>Grocery orders waiting for a shopper.</p>
        </article>
        <article className="app__admin-card">
          <p className="app__admin-userLabel">Shopper track</p>
          <h2>{formatNumber(overview.shopper.in_progress)}</h2>
          <p>Grocery orders currently assigned or being shopped.</p>
        </article>
      </section>

      <section className="app__admin-detailGrid">
        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Chef track</p>
              <h2>Meal prep queue</h2>
            </div>
          </div>

          <div className="app__admin-detailList">
            <div className="app__admin-detailRow">
              <span>Unassigned</span>
              <strong>{formatNumber(overview.chef.unassigned)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>In progress</span>
              <strong>{formatNumber(overview.chef.in_progress)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>Completed this week</span>
              <strong>{formatNumber(overview.chef.completed_this_week)}</strong>
            </div>
          </div>

          <div className="app__admin-actionsWrap">
            <Link href={`/dashboard/${params.role}/meal-orders` as Route} className="app__admin-primaryButton">
              Open meal orders queue
            </Link>
            <Link href={`/dashboard/${params.role}/chefs` as Route} className="app__admin-secondaryButton">
              View chefs roster
            </Link>
          </div>
        </article>

        <article className="app__admin-productSection">
          <div className="app__admin-sectionHeader">
            <div>
              <p className="app__admin-eyebrow">Shopper track</p>
              <h2>Grocery shopping queue</h2>
            </div>
          </div>

          <div className="app__admin-detailList">
            <div className="app__admin-detailRow">
              <span>Unassigned</span>
              <strong>{formatNumber(overview.shopper.unassigned)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>In progress</span>
              <strong>{formatNumber(overview.shopper.in_progress)}</strong>
            </div>
            <div className="app__admin-detailRow">
              <span>Completed this week</span>
              <strong>{formatNumber(overview.shopper.completed_this_week)}</strong>
            </div>
          </div>

          <div className="app__admin-actionsWrap">
            <Link href={`/dashboard/${params.role}/orders` as Route} className="app__admin-primaryButton">
              Open grocery orders queue
            </Link>
            <Link href={`/dashboard/${params.role}/shoppers` as Route} className="app__admin-secondaryButton">
              View shoppers roster
            </Link>
          </div>
        </article>
      </section>
    </section>
  );
}
