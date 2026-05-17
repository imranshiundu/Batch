# packages/core

Domain rules live here.

Owns:

- batch state transitions
- clearing rules
- commitment rules
- refund rules
- escrow release rules
- milestone rules
- slot transfer rules

UI and API code must call core rules instead of duplicating business logic.
