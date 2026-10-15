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
- Keep payment identifier schemas in a browser-safe validation module and customer-number help separate from the home payment form so future payment services can reuse the same rules without changing the UI.
- Keep online-payment rules and demo account data in browser-safe modules, presentation under `components/pago`, and temporary payment context in a root provider; never store payment identity or receipt data in URLs or browser persistence, so the QA flow can be replaced safely by real services.
- Keep collector selection and address confirmation in dedicated payment components, and preserve retry drafts only in the payment provider; use the shared StatusMessage for both payment outcomes so results stay consistent with the site.
