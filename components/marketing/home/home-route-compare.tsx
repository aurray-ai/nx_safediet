import styles from "./home.module.css";
import {
  IconCheckCircle,
  IconDeliveryVan,
  IconFactory,
  IconFarm,
  IconHouse,
  IconPallet,
  IconStoreShelf,
  IconTruck,
  IconWarehouse,
} from "./icons";

const SOURCES = [
  { icon: IconFarm, title: "Farm", sub: "Produce, dairy, meat" },
  { icon: IconFactory, title: "Manufacturer", sub: "Packaged staples" },
  { icon: IconPallet, title: "Wholesaler", sub: "Bulk grocery" },
];

const RETAIL_STOPS = [
  { icon: IconTruck, label: "Distributor" },
  { icon: IconWarehouse, label: "Warehouse" },
  { icon: IconStoreShelf, label: "Store shelf" },
];

function RouteSources() {
  return (
    <div className={styles.routeSources}>
      {SOURCES.map((source) => (
        <div className={styles.routeSource} key={source.title}>
          <span className={styles.routeSourceIcon}>
            <source.icon />
          </span>
          <span>
            <strong>{source.title}</strong>
            <span className={styles.routeSourceSub}>{source.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function RouteMerge() {
  return (
    <div className={styles.routeMerge} aria-hidden="true">
      <svg viewBox="0 0 60 100" preserveAspectRatio="none">
        <path d="M0,15 C30,15 30,50 60,50" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M0,50 L60,50" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M0,85 C30,85 30,50 60,50" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function FlowArrow({ small }: { small?: boolean }) {
  return (
    <svg
      className={small ? styles.flowArrowSm : styles.flowArrow}
      viewBox="0 0 34 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 8h28M23 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeRouteCompare() {
  return (
    <section className={styles.section} id="buying-power">
      <div className={styles.wrap}>
        <div className={styles.routePanel}>
          <div className={styles.routeHeadStatic}>
            <span className={styles.eyebrow}>Get all your groceries in one place</span>
            <h3 className={styles.routeTitle}>
              Plan ahead, buy direct from the source, and save more. We bring it straight to your door.
            </h3>
            {/* <p className={styles.routeSubtitle}>
              When you order ahead, we skip the shop entirely and buy your groceries straight from the farm,
              manufacturer or wholesaler &mdash; not a store that&apos;s already added its own markup. That keeps the
              cost down, and we deliver it straight to your door.
            </p> */}
          </div>

          <div className={`${styles.lane} ${styles.laneSafediet}`}>
            <span className={styles.laneTag}>
              <IconCheckCircle />
              SafeDiet route
            </span>
            <div className={styles.laneRow}>
              <RouteSources />
              <RouteMerge />
              <div className={styles.routeStops}>
                <div className={styles.hubNode}>
                  <div className={styles.hubIcon}>
                    <IconDeliveryVan />
                  </div>
                  <div className={styles.flowLabel}>SafeDiet</div>
                </div>
              </div>
              <FlowArrow />
              <div className={styles.routeDest}>
                <div className={`${styles.flowIcon} ${styles.flowIconDest}`}>
                  <IconHouse />
                </div>
                <div className={styles.flowLabel}>You</div>
                <span className={`${styles.routePrice} ${styles.routePriceBrand}`}>£18.60</span>
              </div>
            </div>
          </div>

          <div className={styles.lane}>
            <span className={`${styles.laneTag} ${styles.laneTagMuted}`}>Grocery Shops / Supermarket route</span>
            <div className={styles.laneRow}>
              <RouteSources />
              <RouteMerge />
              <div className={styles.routeStops}>
                {RETAIL_STOPS.map((stop, index) => (
                  <div className={styles.flowStepGroup} key={stop.label}>
                    {index > 0 && <FlowArrow small />}
                    <div className={styles.flowStepCompact}>
                      <div className={styles.flowIcon}>
                        <stop.icon />
                      </div>
                      <div className={styles.flowLabel}>{stop.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <FlowArrow />
              <div className={styles.routeDest}>
                <div className={`${styles.flowIcon} ${styles.flowIconDest}`}>
                  <IconHouse />
                </div>
                <div className={styles.flowLabel}>You</div>
                <span className={styles.routePrice}>£26.80</span>
              </div>
            </div>
          </div>

          <p className={styles.routeCaption}>
            Illustrative example. Produce &amp; dairy: farm-direct · Pantry staples: manufacturer-direct · Bulk
            items: wholesaler-direct.
          </p>
        </div>
      </div>
    </section>
  );
}
