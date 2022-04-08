# Golden Cross

This app is a tool to help you define entry strategies in the stock market during a crash/recession. **You can find it [by following this link](http://http://45.76.45.94/)**.

- The idea is to come up with a set of rules that determines if you buy or not and at which point in order to get the maximum result after two years of growth. By testing those rules on historical data, you can get an idea of which strategy is the most profitable for stocks with specific criteria.
- The app enables you to write rules of entry using golden crosses on moving averages, and to see how well your rules would have done during the last crashes/recessions. You get global results, but also more precise ones corresponding to the sector/industry/period or other custom tags you've given to the analysed stocks.
- As it was made to answer a precise and timed need of a group of specialized people, the developpment was focused on the features, not the UX/UI, hence the mostly functional look and feel. I hope you'll forgive me if it is an inconvenience to you.  
- It is a simple webpage made in [Angular 12](https://github.com/angular/angular-cli). The server only logs your IP so if you're concerned about privacy just use a VPN. It doesn't keep your data, everything is stored in your browser's local cache and you can import/export it in json format.
- Don't hesitate to reach out to me if you have ideas on how to improve it, I'd be glad to chat with you about that :)

## Prerequisits

1. You must have a Tiingo account to retreive market data (https://www.tiingo.com/account/api/token).
2. You must install an extension for your browser that allows to bypass CORS security for the app to be able to retreive market data (CORS Everywhere is great for Firefox, CORS Unblock for Chrome).

The reason for that second point is that this app is only an exercise in Typescript/Angular so I didn't want to add a separate back-end (which would have solved this problem). Angular doesn't allow to remove CORS security easily, so it has to be done manually. Just activate the extension when using the app and **deactivate it when you're done** (so it doesn't stay on when you're going on other websites).

## How to use the app
### Getting started

To get started, copy [the json content that you can find here](https://pastebin.com/1H2P5Lmh) and replace [REPLACE WITH YOUR TOKEN] on line 2 with your Tiingo token.

Paste it into the text field under **Json data**:
![JSON import](https://res.cloudinary.com/n42c/image/upload/v1633867308/github/01_bagmcy.png)
And click on "Import data in json format".

### Adding stocks and load data

If you have your CORS extension activated, you should now be able to add stocks to your list of tracked stocks in the "Input table" tab by filling its ticker and clicking on the "+" button. Try to fill the Sector, Industry and your custom tags properly since you can use them to filter your results later.
![Adding stocks](https://res.cloudinary.com/n42c/image/upload/v1633867308/github/02_zzuvaf.png)

You can then start to load data by selecting periods for which to detect golden crosses and click on the row's "+" button.
![Adding periods](https://res.cloudinary.com/n42c/image/upload/v1633867307/github/03_x0lcth.png)

When the data is done loading and processing, you can find a new row corresponding to that period. If the button "Show crossings" on the top right corner is enabled, you'll be able to see all the golden crosses the app found.
![Crossings found](https://res.cloudinary.com/n42c/image/upload/v1633867303/github/04_eoagej.png)

At the end of the row, you can see how well your entry strategies would have fared.
![Results for multiple rows](https://res.cloudinary.com/n42c/image/upload/v1633867303/github/06_fim936.png)

### Analysis results

By clicking on the "Results" tab, you'll be able to see how your rulesets have performed overall:
![Overall results](https://res.cloudinary.com/n42c/image/upload/v1633867303/github/07_i7fp1i.png)

Or by sector/industry/period:
![Sector results](https://res.cloudinary.com/n42c/image/upload/v1633867305/github/08_txdsu2.png)

Or by tag:
![Tag results](https://res.cloudinary.com/n42c/image/upload/v1633867306/github/09_sbb0rq.png)

In those examples, the three rulesets are those I included in the json file. 
- Classic is : go all in when you see a 50MA > 200MA golden cross ; 
- Simple is divided in 4 entry points that can happen on crossings of the 30 > 50MA, 50 > 100, 100 > 200, 150 > 200 ; 
- And Rabid is divided in 5 entries that can happen on multiple crossings, but where we only buy if the price is at least 5% lower than the last buy.
They aren't at all very well thinked about, they're just simple examples to start to play with. Obviously, nothing you see here is anything approaching financial advice :)

### Ruleset editing

When you click on the "Rules editor" tab, you end up on this screen:
![Rules editor 1](https://res.cloudinary.com/n42c/image/upload/v1633867306/github/10_o3ogeb.png)

You can add/remove rulesets and specific rules in those rulesets:
![Rules editor 2](https://res.cloudinary.com/n42c/image/upload/v1633867308/github/11_bdgvwc.png)

There is a lot of text on the screen to help you understand what's going on, so I won't decribe it much further.

### Safekeeping 

When you're done playing you can "Export data" and save it in a text file on your computer if you want to be sure not to loose what you did.
![Json export](https://res.cloudinary.com/n42c/image/upload/v1633867305/github/12_c7vi97.png)

### Troubleshooting

If something doesn't seem to work, don't hesitate to press F12 on your keyboard and look at the Console. Errors might be displayed here that I can fix. You can also get more infos in the Console by clicking on the cog and enabling logs:
![Enable logging](https://res.cloudinary.com/n42c/image/upload/v1633867307/github/13_qklflh.png)

## Best practices

- As the calculations happen in your browser, I would suggest not to add all periods at once for each stock since it can put a big workload on your computer. I also added the option to hide a lot of things, both for readability but also because too much data on the screen at once will make your browser really slow.
- The fact that the app keeps the historical and processed data in storage (and/or allows you to export it) also makes you using less bandwidth on your Tiingo account, it can help if you're on a tier with limited bandwidth.
- Try to use as much relevant data as possible in order to reduce the chance of getting skewed results by a small or non-ideal sample. Also maybe consider the length of the recession periods because entry strategies don't give the same results on short/long timeframes at all. If you expect the next market downs to have a long and difficult recovery, maybe don't use data from recession periods shorter than X months.

