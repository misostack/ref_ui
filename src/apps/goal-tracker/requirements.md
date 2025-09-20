> An application to manage goal and tracking goal progress.

First version:

1. Create/Edit/Delete Goals
2. Update goal's progress
3. LocalStorage

Data structure

```ts
class Goal {
  id: number;
  name: string;
  target: number;
  unit: GoalUnit;
  color: string;
  icon: string;
}

class GoalUnit {
  id: number;
  singularName: string;
  pluralName: string;
}

class GoalTrackingLog {
  id: number;
  goalId: number;
  checkInTime: Date;
  value: number;
  unit: GoalUnit;
}
```

Sample Data

**GoalUnit**
| id | SingularName | Plural Name |
| --- | -------- | --------|
| 1 | time | times |
| 2 | day | days |

**Goal**

| id  | Name     | Target | UnitId | Color   | Icon        |
| --- | -------- | ------ | ------ | ------- | ----------- |
| 0   | Learn RN | 100    | 2      | #ff0000 | image01.jpg |

**GoalTrackingLog**

| id  | goalId | checkInTime           | value | UnitId |
| --- | ------ | --------------------- | ----- | ------ |
| 1   | 1      | 2025-09-18T19:10+0007 | 1     | 1      |

Screens:

1. Home

- First time display box to ask user name to store in setting.
- CTA: Default Screen | Click on Home Icon in Navigation
- Button to add new goal (square box with add icon + label)
- Display grid of goals ( square box with background color )
- Goal Box: Goal Name, BackgroundColor, Icon, Progress(x/y [unit]), Check-In Status : face icon(Green-Orange-Red - based on percentage of time left in a day), happy face(always Green)

2. Goal details

- CTA: Click on Goal Box in Home Screen | After Goal Creation
- Edit button: open modal to edit goal name, change goal unit
- Goal Unit modal: Add/Edit/Delete Goal Unit
- Overview Box: X/Y [Goal Unit] - center with background color - icon in top
- Remind to check in if not done yet | Congratulation if already check-in | Show the best record value(streak)
- Check-In:
  - A TextBox to enter the progress. Default value is 1
  - Date Selection: default is today
  - Submit button: Complete
- Skip:
  - Skip button: Skip
- Grid of check-in logs: show current weeks, box and and progress for each day. User can change filter to select current month, 30 days

3. New Goal

- CTA: Click on New Goal Tab
- TextBox for goal name : Name
- TextBox for target value: Target
- Select Box for Goal Unit: Goal Unit
- Save Button
- After creation, redirect to Goal Details

4. Setting

- CTA: click on Setting Tab
- TextBox for change name
- Select Background color for time range(morning,afternoon, evening)
- Change language (default will be user phone language), if language not support, default language is english
- Notification: enable alert Good Morning|Good Afternoon| Good Evening.
- Reset Data: reset all data and settings to default, ask user for confirmation, after reset go back to home screen and ask user name.

Global:

1. Header: App Icon, Good Morning|Good Afternoon| Good Evening, Help Icon
2. Navigation(bottom): Home, New Goal, Setting
3. Background Color: will change automatically according to the time of day.

## UI & UX requiments

1. Color Palette:

- #F9F5F0
- #F2EAD3
- #F4991A
- #344F1F
