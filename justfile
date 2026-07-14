# NautLoop-Website — common dev tasks
# Run `just` to see all recipes; `just <recipe>` to execute.

REPO := "48Nauts/NautLoop-Website"
FORGEJO_BASE := "http://cosmos.tail138398.ts.net:3000"

default:
    @just --list

# ─── Push / sync ────────────────────────────────────────────────

# push to Forgejo (source of truth) and GitHub (Pages deploy)
push:
    git push forgejo
    git push origin

push-forgejo:
    git push forgejo

push-github:
    git push origin

pull:
    git pull --rebase forgejo

# ─── Open in browser ────────────────────────────────────────────

open:
    open "{{FORGEJO_BASE}}/{{REPO}}"

ci:
    open "{{FORGEJO_BASE}}/{{REPO}}/actions"

issues:
    open "{{FORGEJO_BASE}}/{{REPO}}/issues"

prs:
    open "{{FORGEJO_BASE}}/{{REPO}}/pulls"

site:
    open "https://nautloop.example"

# ─── Branch helpers (auto-open tracking issue on push) ──────────

feature name:
    git checkout -b feature/{{name}}

fix-branch name:
    git checkout -b fix/{{name}}

incident name:
    git checkout -b incident/{{name}}

# ─── Static site ────────────────────────────────────────────────

# serve locally on :8123
serve:
    python3 -m http.server 8123
