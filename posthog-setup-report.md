<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the visual-editor Next.js 15 App Router project.

**Changes made:**

- Created `instrumentation-client.ts` at the project root — initializes PostHog (posthog-js) client-side via the Next.js 15.3+ instrumentation hook with exception capture enabled.
- Configured environment variables in `.env.local` (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`).
- Added `posthog.identify()` calls on login to link events to known users (using user ID and email as traits).
- Added `posthog.capture()` calls for 6 key business events across 6 components.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in via Google OAuth | `src/components/auth/GoogleLogin/GoogleLogin.tsx` |
| `user_logged_in_test_account` | User successfully logged in using a test account | `src/components/auth/TestAccountLogin/TestAccountLogin.tsx` |
| `project_created` | User created a new project (blank canvas or image upload) | `src/components/NewProjectModal/NewProjectModal.tsx` |
| `image_uploaded_to_project` | User uploaded an image texture to an existing project | `src/components/CreatorToolbox/components/UploadImage/UploadTexture.tsx` |
| `asset_removed` | User removed an asset from the canvas | `src/components/CreatorToolbox/components/RemoveAsset/RemoveAsset.tsx` |
| `effect_added` | User added a new shape effect in the shape properties panel | `src/components/CreatorPanels/components/ShapePropsPanel/ShapePropsPanel.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/163653/dashboard/634905
- **Login funnel: Sign in → Project created:** https://eu.posthog.com/project/163653/insights/8900L0mW
- **Logins over time:** https://eu.posthog.com/project/163653/insights/xPp6DORa
- **Projects created over time:** https://eu.posthog.com/project/163653/insights/J2Tlk4tk
- **Editor engagement: Image uploads & Effects added:** https://eu.posthog.com/project/163653/insights/ybg8f5R8
- **New project canvas size breakdown:** https://eu.posthog.com/project/163653/insights/UFIxGyJm

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
