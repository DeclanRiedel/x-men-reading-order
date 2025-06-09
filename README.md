# X-Men Reading Order

A comprehensive reading order guide for X-Men comics

-  Complete X-Men reading order
-  Search functionality
-  Bookmark your progress
-  Comic cover display

## Data Sources
- Main reading order: [@DoctorSloshee's X-Men Reading Order](https://www.reddit.com/r/xmen/comments/15a71l3/the_comprehensive_xmen_reading_list_2023_update/)
- Additional entries: [Comic Book Reading Orders](https://comicbookreadingorders.com/marvel/characters/x-men-reading-order/)

## Todo
- breakpoints & search for major events 
- auto update json as csv grows
- download all issue summaries & covers instead of api calls / find out how leagueofcomicgeeks do it
- dialogue for arc/issue summaries - consider api calls currently (3000/day lim)
- auto update xlxs -> csv -> json or marvel api directly for related issues

## Things to fix later
- duplicate mobile hooks
    components/ui/use-mobile.tsx
    hooks/use-mobile.tsx
- unused ui components
- remove toasts, was a horrible idea from the start
- error handling for comic covers once i manage that
- fix types and seperate from lib/utils
- batching for summaries once that comes, api calls used there or just 10x the one json file idk if that's really that bad 
- fix header for mobile view since its really really ugly
- search does not jumpto for compactview
## Notes:
edited row 5015 of the xlsx incrementing order numbers 512.011 since duplicate at 5015 & 5016 
