# Safediet Web

This is the new unified Next.js frontend that will replace the current split between:

- `safediet_ui` for the customer and internal React app
- `safedaet_admin` for the older Next.js admin app

Initial migration slice included here:

- App Router scaffold
- shared server-side auth/session model
- login route handler
- role-aware dashboard shell
- first server-rendered admin products page

Next migration targets:

1. public marketing pages from `safediet_ui`
2. customer onboarding and install flows
3. full products CRUD
4. meals and promotions workspaces
# nx_safediet
