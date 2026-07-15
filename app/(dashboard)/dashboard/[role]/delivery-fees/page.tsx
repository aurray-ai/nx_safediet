import { DeliveryFeeRulesManager } from "@/components/dashboard/delivery-fee-rule-form";
import { fetchAdminMetadata, fetchDeliveryFeeRules } from "@/lib/api";

export default async function DeliveryFeesPage() {
  const [metadata, rules] = await Promise.all([fetchAdminMetadata(), fetchDeliveryFeeRules()]);

  return (
    <section className="app__admin-groceries">
      <section className="app__admin-groceriesHeader">
        <div>
          <p className="app__admin-eyebrow">Delivery fees</p>
          <h2 className="app__admin-groceriesTitle">Weight-band pricing</h2>
          <p>Manage the flat delivery charge that checkout applies based on total cart weight.</p>
        </div>
      </section>

      <DeliveryFeeRulesManager supportedCountries={metadata.supported_countries} initialRules={rules.items} />
    </section>
  );
}
