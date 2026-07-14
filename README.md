# NautLoop-Website

> Product website for NautLoop — domain TBD

Follows the xnaut.dev architecture: plain static HTML/CSS + minimal JS,
Forgejo source of truth, GitHub Pages deploy mirror. Site gets built via
the `/ship-product-site` skill once the NautLoop product docs land.

## Development

```sh
just serve   # local server on :8123
just push    # push Forgejo + GitHub
```
