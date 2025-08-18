# Route Test Checklist

This checklist enumerates all app routes and tabs to verify rendering, navigation, and header/tab config.

Legend: [ ] Not tested, [OK] Loaded without runtime errors, [WARN] Needs review

## Tabs
- [ ] /(tabs)/index (Home)
- [ ] /(tabs)/workouts
- [ ] /(tabs)/meals
- [ ] /(tabs)/medical
- [ ] /(tabs)/coaching
- [ ] /(tabs)/profile

## Root
- [ ] / (app/index)
- [ ] /+not-found
- [ ] /modal
- [ ] /api-status
- [ ] /test-apis
- [ ] /test-backend

## Auth
- [ ] /(auth)/login
- [ ] /(auth)/signup
- [ ] /(auth)/coach-login

## Admin
- [ ] /admin/login
- [ ] /admin/dashboard
- [ ] /admin/database
- [ ] /admin/messages
- [ ] /admin/reports
- [ ] /admin/settings
- [ ] /admin/testing

## Brand
- [ ] /brand
- [ ] /brand/affiliate
- [ ] /brand/challenges
- [ ] /brand/exclusive-gear
- [ ] /brand/guides
- [ ] /brand/membership

## Coach
- [ ] /coach/dashboard
- [ ] /coach/clients
- [ ] /coach/messages
- [ ] /coach/rehab
- [ ] /coach/rehab/exercise/[id]
- [ ] /coach/schedule
- [ ] /coach/settings

## Coaching
- [ ] /coaching/[id]
- [ ] /coaching/message/[id]

## Contest
- [ ] /contest/create
- [ ] /contest/create-protocol
- [ ] /contest/dashboard
- [ ] /contest/dehydration
- [ ] /contest/nutrition
- [ ] /contest/peak-week
- [ ] /contest/posing
- [ ] /contest/progress
- [ ] /contest/protocols

## Exercise & Plans
- [ ] /exercise/[id]
- [ ] /plan/[id]
- [ ] /category/[id]
- [ ] /workout/[id]
- [ ] /workouts/generate
- [ ] /workouts/generate-group
- [ ] /workouts/templates

## Meals & Nutrition
- [ ] /meals
- [ ] /meals/[id]
- [ ] /meals/add
- [ ] /meals/grocery-prices
- [ ] /meals/log
- [ ] /meals/plan
- [ ] /meals/plans
- [ ] /meals/plans/[id]
- [ ] /meals/price-alerts
- [ ] /meals/progress
- [ ] /meals/scan
- [ ] /meals/shopping-list

## Medical & Health
- [ ] /medical
- [ ] /medical/ai-analysis
- [ ] /medical/bloodwork/[id]
- [ ] /medical/interactions
- [ ] /medical/scan
- [ ] /medical/upload
- [ ] /medicines/[id]

## Profile
- [ ] /profile
- [ ] /profile/account
- [ ] /profile/payment
- [ ] /profile/notifications
- [ ] /profile/settings
- [ ] /profile/privacy
- [ ] /profile/subscription
- [ ] /profile/support

## Questionnaire
- [ ] /questionnaire
- [ ] /questionnaire/client
- [ ] /questionnaire/coach-assessment

## Shop
- [ ] /shop
- [ ] /shop/cart
- [ ] /shop/checkout
- [ ] /shop/order/[id]
- [ ] /shop/product/[id]
- [ ] /shop/scan

## Supplements
- [ ] /supplements/[id]
- [ ] /supplements/details

## Teams
- [ ] /teams/manage

## Testing (internal demos)
- [ ] /testing/gym-environment
- [ ] /testing/nutrition-scenarios
- [ ] /testing/wellness-tracking
