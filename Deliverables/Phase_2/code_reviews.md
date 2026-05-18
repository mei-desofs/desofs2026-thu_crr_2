[Back to README](../README.md)

---

# GitHub Code Review Process

## Objective

The **Code Review** process is a fundamental stage of our development lifecycle. It ensures code quality, helps knowledge sharing across the team and above all, guarantees application security. 

This document establishes the guidelines for how Pull Requests (PRs) are evaluated, integrating automated validation (defined in [automation.md](automation.md)) with human review.

---

# Code Review Workflow

Our process is structured into 4 sequential phases:

` ` `
[Author Creates PR] ──> [Pipeline Runs] ──> [Human Review] ──> [Approval & Merge]
` ` `

---

## Phase 1: Preparation and Submission (Author)

Before requesting a review from others, the author must ensure that the Pull Request is properly structured. Every PR must strictly follow the standard template to provide context for the reviewers.

### Best Practices for PR Creation:
* **🎯 Clear Goal:** Explain the reason for the change (e.g., referencing specific business rules).
* **📝 Technical Details:** List the altered files and the impact of each change (e.g., new utility functions).
* **🧪 Testing Guide:** Provide clear steps on how to replicate and test the behavior locally, detailing the expected outcome.
* **✅ Completed Checklist:** Ensure the code has passed the author's own initial self-review.

---

## Phase 2: Automated Validation

As soon as a PR is opened or updated, **GitHub Actions** takes on the role of an "automated reviewer." **Human reviewers should only begin their analysis after all checks are green (Green Builds).**

Reviewers must verify that the pipeline has validated successfully:

| Pipeline Stage | What was automatically validated? | What to do if it fails? |
| :--- | :--- | :--- |
| **Initial Security** | `Gitleaks` (Secrets) and `Dependency Review` / `NPM Audit`. | The author must immediately remove exposed credentials or fix vulnerable dependencies. |
| **Quality & Testing** | TypeScript compilation and `Unit Tests` with adequate coverage. | The author must fix logic breaks or update the unit tests. |
| **Static Analysis** | `CodeQL` and `NodeJsScan` (SAST). | Fix code security flaws or bad practices detected by the tools. |
| **Dynamic Validation** | `Integration Tests` (MySQL) and `OWASP ZAP` (DAST). | Check for integration breaks with the database or vulnerabilities exposed at runtime. |

---

## Phase 3: The Human Review

With the pipeline approved, reviewers focus on aspects that automated tools cannot evaluate: semantics, architecture, and code intent.

### 1. Alignment with the Goal (Business Rules)
* Does the change actually solve the proposed problem? 

### 2. Readability and Best Practices
* Is the code clean and easy to understand?
* Are the functions reusable and do they follow the single responsibility principle?
* Were comments added where the logic is inherently complex?

### 4. Test Coverage
* If a new feature or a bug fix was introduced, were corresponding unit or integration tests included?

---

## Phase 4: Interaction and Resolving Comments

* **Giving Feedback:** Reviewers must be clear.
* **Responding to Feedback:** The author can apply suggestions directly or argue why a certain approach was chosen.
* **Resolving Threads:** A comment thread should only be marked as **"Resolved"** after the author applies the fix or both parties reach a consensus.

---

# Merge Criteria

A Pull Request is only eligible to be merged into the `main` branch when it meets the following cumulative requirements:

1. 🟢 **100% Functional Pipeline:** All GitHub Actions checks (`main_pipeline.yml`) have passed successfully.
2. 👥 **Required Approvals:** At least **1 or 2 approvals (Approve)** from development team members.
3. 💬 **No Open Discussions:** All conversation threads in the PR must be resolved.

---
[Back to README](../README.md)
