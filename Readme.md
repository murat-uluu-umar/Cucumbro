# Warptimer

This extension will improve your efficiency. It based on time management technique - \"flowtime\". It counts your working time. And after you'll get rest time third of working time.

# Usage

It's not marvellous util, that you cannot understand. Everythin as simple as possible. But however I'll explain it.

## Warptimer UI
![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20start%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1.  Here you'll input subject name that you're learning.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. There are buttons, you know. They're do what they do...

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20stopwatch%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. It's stopwatch, you know. You just need to do your job, it counts your learning time.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. These buttons do what they do. When you'll get tired and out of focus press "Rest" button to rest. Here you can see "Divert" button. If someone draws you away, you can click it to pause stopwatch, after you'll resume it.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20countdown%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. Here you can see countdown. It'll start after you'll click "Rest" button. Your rest will last third of your working time, it's enough for break. 
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. You also able to skip the rest, just press "Skip" button.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20congratulations%20window.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. This display shows you some kind of "Motivation" words and amount of time that you spent on your subject, rest and diverts.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. Do you remember that "Chart" button above? It makes the such thing as this button. It kicks you to "User statistics" panel, the main feature of my extension!

## User Statistics UI

It consists of two panels: day statistics and overall statistics.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%20tab.PNG?raw=true)

### Firstly, let's look at inputs!

> ![](https://placehold.co/15x15/yellow/yellow.png) 1. This is calendar, here you'll choose certain day, which interests you. You can see here orange colored buttons surrounded by dark bluish. Orage tint shows that you've done something in this day.

> ![](https://placehold.co/15x15/yellow/yellow.png) 5. This big panel plays button role. It switchs your view onto second "overall score/statistics" panel.

### It's time for outputs!
> ![](https://placehold.co/15x15/red/red.png) 2. Here will be shown some detailed information of each session.
> ![](https://placehold.co/15x15/red/red.png) 3. Here will be shown total amount of time spent on tasks etc.
> ![](https://placehold.co/15x15/red/red.png) 4. It's circular chart **that will compare sessions duration**.
> ![](https://placehold.co/15x15/red/red.png) 5. It's the same chart **that will compare total amounts of time spent on sessions whith whole day (16 hours - sessions)**.

Look at example:
![Example](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%202%20tab.PNG?raw=true)

### Let's look at overall statistics

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%203%20tab.PNG?raw=true)

> ![](https://placehold.co/15x15/red/red.png) 1. This graph shows how much minutes you spent on sessions per day. Also, you can zoom and grab it.
-------------
> ![](https://placehold.co/15x15/yellow/yellow.png) 2. Remember, ***you able to hide certain subjects, just click on their name/label.***
> ![](https://placehold.co/15x15/yellow/yellow.png) 3. You'll return to day score panel by pressing it.
> ![](https://placehold.co/15x15/yellow/yellow.png) 4. These buttons do what they do, you know...

Okay just for clarity
 1. You can export your data as CSV file and do some manipulations in Excel.
    Data will get the same order as there: 
    | Days | Subject1 | Subject2 | Subject3 |
    |------|----------|----------|----------|
    |01.12.2022| 78968 |    4354 |    46574 |
    |02.12.2022| 7968 |    8354 |    4674 |
    |03.12.2022| 7892 |  44354 |    49574 |
    | etc.. | | | |
    Those strange random digits are Excel's serial numbers, you just need to [format they into time](https://support.microsoft.com/en-us/office/format-numbers-as-dates-or-times-418bd3fe-0577-47c8-8caa-b4d30c528309#:~:text=On%20the%20Home%20tab%2C%20in,that%20you%20want%20to%20use.). 
 2. Also you able to make backups by exporting and importing json data. Play with it the way that want. I give you permission :smiling_imp:
 3. And you may clear all your data if you want.

