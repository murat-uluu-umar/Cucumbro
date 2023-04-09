# Warptimer

This extension based on time management technique - \"flowtime\", it'll improve your efficiency and do some statistic calculations for you.  

# Installation
  1. Goto ![itch.io](https://murat-uulu-umar.itch.io/warptimer)
  2. Download and extract .zip file somewhere you want .
  3. Just open chrome://extensions/ and drag onto it that unpacked file.  
# Usage

This extension as simple as possible. But, I'll explain it.

## Warptimer UI
![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20start%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1.  Here you'll input subject name that you're learning.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. Here are buttons, you know. They're do what they do...

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20stopwatch%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. It's stopwatch, you know. You just need to do your job, while it counts your learning time.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. When you'll get tired and out of focus press "Rest" button to get a break. Here you can see "Divert" button. If someone draws you away, you can click it to pause stopwatch, after you'll resume it.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20countdown%20state.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. Here you can see countdown. It'll start after you'll click "Rest" button. Your break will last third of your working time, it's enough for break. 
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. Also, you able to skip the rest, just press "Skip" button.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/Warp%20timer%20-%20congratulations%20window.PNG?raw=true)

- ![](https://placehold.co/15x15/red/red.png) 1. This display shows you some kind of "motivation" words and amount of time that you spent on your subject, break and diverts.
- ![](https://placehold.co/15x15/yellow/yellow.png) 2. Do you remember that "Charts" button above? It makes the such thing as this button. It kicks you to "User statistics" panel, the main feature of my extension!

Imagine this cycle as one session.

## User Statistics UI

It consists of two panels: day statistics and overall statistics.

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%20tab.PNG?raw=true)

### Firstly, let's look at inputs!

> ![](https://placehold.co/15x15/yellow/yellow.png) 1. This is calendar, here you'll choose certain day, which interests you. You can see here orange colored buttons surrounded by dark bluish others. Orange tint shows that you did something in this day.

> ![](https://placehold.co/15x15/yellow/yellow.png) 5. This big panel plays button role. It switches view onto second “overall score/statistics” panel.

### It's time for outputs!
> ![](https://placehold.co/15x15/red/red.png) 2. Here will be shown some detailed information of each session. <br>
> ![](https://placehold.co/15x15/red/red.png) 3. Here will be shown total amount of time spent on tasks etc. <br>
> ![](https://placehold.co/15x15/red/red.png) 4. It's circular chart ***that will compare sessions duration***. <br>
> ![](https://placehold.co/15x15/red/red.png) 5. It’s chart similar to above that will ***compare total amount of time spent on sessions with whole day*** (16 hours - sessions).

Look at example:
![Example](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%202%20tab.PNG?raw=true)

### Let's look at overall statistics

![](https://github.com/murat-uluu-umar/Warptimer/blob/%23feature-readme/Additions/User's%20statistics%203%20tab.PNG?raw=true)

> ![](https://placehold.co/15x15/red/red.png) 1. This graph shows how many minutes you spent on sessions per day. Also, you can zoom and grab it. <br>
-------------
> ![](https://placehold.co/15x15/yellow/yellow.png) 2. Remember, ***you able to hide certain subjects, just click on their name/label.*** <br>
> ![](https://placehold.co/15x15/yellow/yellow.png) 3. You'll return to day score panel by pressing it. <br>
> ![](https://placehold.co/15x15/yellow/yellow.png) 4. These buttons do what they do, you know... <br>

Okay just for clarity
 1. You can export your data as CSV file and do some manipulations in Excel.
    Data will get the same order as here: 
    | Days | Subject1 | Subject2 | Subject3 |
    |------|----------|----------|----------|
    |01.12.2022| 78968 |    4354 |    46574 |
    |02.12.2022| 7968 |    8354 |    4674 |
    |03.12.2022| 7892 |  44354 |    49574 |
    | etc.. | | | |
Those strange random digits are Excel serial numbers, you just need to [format they as time](https://support.microsoft.com/en-us/office/format-numbers-as-dates-or-times-418bd3fe-0577-47c8-8caa-b4d30c528309#:~:text=On%20the%20Home%20tab%2C%20in,that%20you%20want%20to%20use.). <br> 
 2. Additionally, you able to make backups by exporting and importing json data. Play with it the way that you want. I give you permission :smiling_imp: <br>
 3. And you may clear all your data if you want :man_shrugging: .

