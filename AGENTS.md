<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep outage-domain logic isolated under `src/components/interrupciones` and `src/lib/interrupciones-data.ts` so mock data can be replaced by live services without rewriting the UI.
- Use a dedicated map-event detail card, separate from supply-query cards, so map presentation changes do not alter customer-query scenarios.
- Keep map-reference timeline styling as an opt-in presentation of the shared Tracker; derive all steps from the same logic to avoid diverging supply and map states.
- Keep news content in a browser-safe typed data module and render listing and article detail as separate routes; this allows verified content or future services to replace prototype data without changing the editorial presentation.
