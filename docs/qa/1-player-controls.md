### Item to test #1: Player Controls

#### Item to test #1.1: Player Controls - Btns

From left to right 

![player-controls](./images/player-controls.png)

| item | Buttons      |  Steps        | Expected Results   |
|---|---           |---            |---                 |
| 1.1.1 |RollBack      | click         | To rewind of a set amount, 15 sec default  |
| 1.1.2 |rewind        | click         | Rewind 10 sec  |
| 1.1.3 |rewind        | click - hold  | Continue to rewind until release of btn  |
| 1.1.4 |play          | click         | play media, audio or video  |
| 1.1.5 |fast forward  | click         | Fast forward 10 sec   |
| 1.1.6 |fast forward  | click - hold  | Continue to fast forward until release of btn  |
| 1.1.7 |Playback speed | click - select| change the playback speed, of amount from dropdown  |
| 1.1.8 |current time  | display       | display current time of media, updates while playing  |
| 1.1.9 |current time  | click         | triggers prompt to jump to set time, using custom formats options  |
| 1.1.10|Duration      | display       | display duration of media    |
| 1.1.11|Volume        | click - Toggle| Mutes and un-mutes media   |

#### Item to test #1.2: Player Controls - Preview

![player-controls-preview](./images/player-controls-preview.png)

##### Steps:
- Click on the media preview on the left
##### Expected Results: 
- [ ] if media paused expect to start playing
- [ ] if media playing expect to pause playing

#### Item to test #1.3: Player Controls - Progress Bar

##### Steps:
- Click inside the progress bar

##### Expected Results: 
- [ ] Expect the progress bar play head to change to clicked point
- [ ] Expect current time  display in player controls to update accordingly
- [ ] If media was paused, expect media to start playing
- [ ] Expect the editor to jump to the current word below
