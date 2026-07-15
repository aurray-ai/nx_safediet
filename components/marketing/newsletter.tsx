import Link from "next/link";

export function Newsletter() {
  return (
    <section className="app__newsletter ">
      <div className="app__newsletter-heading">
        <div className="app__newsletter-subheading" style={{ marginBottom: "1rem" }}>
          <p className="p__cormorant">Stay updated</p>
          <img src="/assets/spoon.svg" alt="spoon_image" className="spoon__img" />
        </div>
        <h1 className="headtext__cormorant">Get healthier meal planning updates</h1>
        <p className="p__opensans">
          Join for product updates, planning tips, and new support options.
        </p>
      </div>

      <div className="app__newsletter-input flex__center">
        <input type="email" placeholder="Enter your email address" />
        <Link href="/start-planning" className="custom__button">
          Join Now
        </Link>
      </div>
    </section>
  );
}
