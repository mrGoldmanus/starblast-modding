// 1st SRC Public Event
// All changes is used, relevant at the time of the weekend on these tracks
// Special thanks to Notus, for testing and code review

var qualification_duration = 200;
var race_laps = 4;
var positions = ["1st","2nd","3rd"]; // For messages
var collectibles = 1 ; // Value is not used in any way
var time_after_race = 35;

var race_start_delay = 11;
var race_start_timer = 3;
var race_close_time = 20;

var ship_switch_delay = 0.5;

var spr = [101,102,103,104,105,106];
var end = [201,202,203,204,205,206];

var map_size = 100;

var sp = "sprint race" ;
var en = "endurance race" ;
var fp = "free practice";


var map_name_type = en; // "sp" or "en"
var vehicle_type = end; // end - endurance, spr - sprint
// endurance ships have 2 weapon/booster slots, sprint - only 1
// sprint ships have better booster speed 
// choose "end" to unlock weapons 
// Welcome message depends on the selected

var drs_step = 605;
var pitlane_step = 1350;
var pitlane_span = 650;
var enable_drs_on_race_lap = 2;
var enable_pitlane = vehicle_type != spr;

var SpawnX, SpawnY;

/*
game.ships[0].set({x:250,y:-95}); -start
game.ships[0].set({x:400,y:-160}); -spawn

game.ships[0].gameover({"Rating":"Kick!","Score":0})

S2 : 155,-115
S3 : 65, -335
*/ 

var Wx = -45;
var Wy = -190;

// AFK settings
var afk_timeout = 15;
var afk_speed = 0.25;
var afk_action = function(ship) {
  resetShip(ship);
};

var troll_timeout = 75;
// var troll_afk_timeout = afk_timeout / 2;


// Out lap detection settings
var outlap_delay = 2;
var onlap_blink_time = 2.5;
var lap_map_precision = 2;
var lap_map_overlap = 1;


var welcome_message = {
  [sp]: "\nToday is sprint race. Short distance, powerful boosters, closed pit lane, and only 1 booster slot. Intense race and important qualification position. Good luck!",
  [en]: "Today is endurance race. Long distance. Position in qualification is not so important. Weaker boosters, but 2 weapon/booster slots, and an open pitlane with mines and missiles in the race. Good luck!",
  [fp]: "\nIt's free practice. The test of the track. You can study the track, but don't forget about the simple rules! (Without trolling, the Zoltar from FIA is still watching you!) Good luck!",
};

// TODO: Added for public events only
welcome_message[map_name_type] = "SRC open championship! There is a standings appear between races. For victory and other high places you get points. At the end of the last race, if you have the most points - you are the champion!";

var vocabulary = [
      { text: "Hello", icon:"\u0045", key:"H" },
      { text: "Bye Bye!", icon:"\u0027", key:"B" },
      { text: "Yes", icon:"\u004c", key:"Y" },
      { text: "No", icon:"\u004d", key:"N" },
      
      { text: "GG", icon:"\u00a3", key:"G" },
      { text: "Overtake!", icon:"\u00bd", key:"O" },
      { text: "A'm a torpedo!", icon:"\u006a", key:"T" },
      { text: "Box,box", icon:"\u0034", key:"X" },
      
      { text: "Sorry", icon:"\u00a1", key:"S" },
      { text: "WTF", icon:"\u004b", key:"Q" },
      { text: "No Problem", icon:"\u0047", key:"P" },
      { text: "Wait", icon:"\u0046", key:"W" },      
    ] ;




// Sprint ships

var Booster_101 = '{"name":"Booster","level":1,"model":1,"size":1.62,"zoom":0.75,"designer":"Zerd","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[600,600],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main1":{"section_segments":12,"offset":{"x":57,"y":-55,"z":-11},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-55,-33,-40,0,10,40,48,66,77,67],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,6,15,20,14,14,20,20,15,0],"height":[0,6,15,20,14,14,20,20,15,0],"propeller":true,"texture":[4,18,10,63,8,63,11,12,17]},"main2":{"section_segments":12,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-60,-50,-20,10,15,45,75,60],"z":[-7,-7,-5,0,0,0,0,0,0]},"width":[0,8,15,25,25,20,20,14,0],"height":[0,6,10,15,18,18,18,14,0],"propeller":true,"texture":[12,63,10,1,5,8,12,17]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-48,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[-5,10,30,60],"z":[-20,-8,0,0]},"width":[5,8,12,5],"height":[4,10,10,5],"propeller":false,"texture":[7,9,4,4]},"cannons":{"section_segments":6,"offset":{"x":20,"y":30,"z":15},"position":{"x":[0,0,0,0,0,0],"y":[-60,-70,-30,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]},"cannons2":{"section_segments":6,"offset":{"x":27,"y":0,"z":-5},"position":{"x":[0,0,0,0,0,0],"y":[-70,-80,-35,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]}},"wings":{"main1":{"length":[20,20],"width":[50,30,15],"angle":[-10,-15],"position":[0,-20,-11],"doubleside":true,"offset":{"x":20,"y":-12,"z":5},"bump":{"position":35,"size":15},"texture":[11,63]},"main2":{"length":[30],"width":[33,15],"angle":[-20],"position":[0,20],"doubleside":true,"offset":{"x":65,"y":-33,"z":-9},"bump":{"position":30,"size":15},"texture":[8]}},"typespec":{"name":"Booster","level":1,"model":1,"code":101,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[600,600],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[1.948,1.961,1.851,3.401,4.014,3.862,3.697,3.331,3.078,2.845,3.025,3.092,3.043,2.514,2.52,2.456,1.934,1.339,1.449,1.627,1.918,2.398,2.784,3.335,3.298,2.435,3.298,3.335,2.784,2.398,1.918,1.627,1.449,1.339,1.934,2.456,2.52,2.514,3.043,3.092,3.025,2.845,3.078,3.331,3.697,3.862,4.014,3.401,1.851,1.961],"lasers":[],"radius":4.014,"next":[]}}';

var Astral_Accelerator_102 = '{"name":"Astral Accelerator","level":1,"model":2,"size":1.5,"zoom":0.75,"designer":"Finalizer","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":10,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-90,-93,-95,-90,-30,0,50,100,105],"z":[-7,-7,-7,-7,-7,-7,0,0,0]},"width":[20,23,25,27,30,27,30,26,0],"height":[0,6,8,10,15,18,8,10,0],"texture":[17,13,63,1,10,1,10,12]},"stripes":{"section_segments":16,"offset":{"x":15,"y":-40,"z":10},"position":{"x":[-4,-4,-4,11,5,0,0,0],"y":[-92,-30,0,50,100],"z":[1,6,10,3,3,0]},"width":[3,3,3,3,3,3],"height":[1,1,1,1,1],"texture":[63]},"cockpit":{"section_segments":10,"offset":{"x":0,"y":-20,"z":17},"position":{"x":[0,0,0,0,0,0],"y":[10,30,40,70,80],"z":[-2,0,0,0,0]},"width":[7.5,10,10,9.5,0],"height":[3,10,11,10,0],"texture":[9,4,13,4],"propeller":false},"detail":{"section_segments":8,"angle":3,"offset":{"x":26,"y":-50,"z":6},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,3,7,11,14,17,21,25,28,31,35,39,42,45,49,53,57],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[1,4,6,4,1,4,6,4,1,4,6,4,1,4,6,4,1],"height":[1,4,6,4,1,4,6,4,1,4,6,4,1,4,6,4,1],"texture":[4,17,17,4,4,17,17,4,4,17,17,4,4,17,17,4]},"engine":{"section_segments":4,"offset":{"x":0,"y":-95,"z":18},"position":{"x":[0,0,0,0],"y":[-18,-15,15,18],"z":[0,0,0,0]},"width":[0,10,10,0],"height":[0,4,4,0],"texture":[18]},"bracings1":{"section_segments":8,"angle":90,"offset":{"x":0,"y":-85,"z":18},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-15,-14,-11.5,-10,-8,0,8,10,11.5,14,15],"z":[-20,-10,-1,1,2,0,2,1,-1,-10,-20]},"width":[4,4,4,4,4,5,4,4,4,4,4],"height":[0,10,4,3,2,3,2,3,4,10,0],"propeller":false,"texture":[13]},"bracings2":{"section_segments":8,"angle":90,"offset":{"x":0,"y":-105,"z":18},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-15,-14,-11.5,-10,-8,0,8,10,11.5,14,15],"z":[-20,-10,-1,1,2,0,2,1,-1,-10,-20]},"width":[4,4,4,4,4,5,4,4,4,4,4],"height":[0,10,4,3,2,3,2,3,4,10,0],"propeller":false,"texture":[13]},"engines":{"section_segments":12,"offset":{"x":18,"y":0,"z":15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[25,20,25,40,75,70,65],"z":[5,0,0,0,0,0,0,0]},"width":[0,5,7,8,8,6,0],"height":[0,14,15,15,13,10,0],"texture":[13,1,63,10,18,17],"propeller":true}},"wings":{"main":{"length":[46,0,25,-25,20],"width":[100,20,70,0,70,10],"angle":[10,0,110,110,-70],"position":[-30,5,-10,30,-10,20],"texture":[18,11,63],"doubleside":true,"bump":{"position":30,"size":7},"offset":{"x":0,"y":30,"z":0}},"font":{"length":[45],"width":[61,10],"angle":[-6,20],"position":[-60,-100],"texture":[63],"doubleside":true,"bump":{"position":30,"size":20},"offset":{"x":0,"y":-20,"z":5}}},"typespec":{"name":"Astral Accelerator","level":1,"model":2,"code":102,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.058,4.112,4.016,3.983,1.924,1.681,1.362,1.335,1.111,1.114,1.432,1.413,1.408,1.442,1.495,1.584,1.707,1.9,2.145,2.274,2.14,2.112,2.381,2.366,2.29,1.95,2.29,2.366,2.381,2.112,2.14,2.274,2.145,1.9,1.707,1.584,1.495,1.442,1.41,1.413,1.432,1.114,1.111,1.335,1.362,1.681,1.924,3.983,4.016,4.112],"lasers":[],"radius":4.112,"next":[]}}';

var V2_103 = '{"name":"V2","designer":"Void","level":1,"model":3,"size":1.5,"zoom":0.7,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-75,-20,0,45,76,95,85],"z":[0,0,0,0,0,0,0,0]},"width":[0,15,20,25,25,25,20,0],"height":[0,10,20,20,20,20,15,0],"propeller":true,"texture":[63,2,2,10,2,4,17],"vertical":false},"topDetail":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":48,"z":29.8},"position":{"x":[3,-2,3,-2,4,1,-2],"y":[-30,-10,-10,5,5,15,15],"z":[0,0,0,0,0,0,0]},"width":[0,6,6,7,8,9,0],"height":[0,1,1,1,1,1,0],"propeller":false,"texture":[63],"angle":0,"vertical":false},"backDetailbottom":{"section_segments":[45,135,225,315],"offset":{"x":-57,"y":35,"z":6},"position":{"x":[5,0,5,0,6,3,0],"y":[-35,-15,-15,5,5,15,15],"z":[0,0,0,0,0,0,0]},"width":[0,6,6,7,8,9,0],"height":[0,2,2,2,2,2,0],"propeller":false,"texture":[3],"angle":-5},"hundredpercentlegitname":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":20,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":90},"hundredpercentlegitname2":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":65,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":-90},"thingydetailsinbetween":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":0},"thingydetailsinbetweensider":{"section_segments":[45,135,225,315],"offset":{"x":14,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":0},"thingydetailsinbetween_insider":{"section_segments":[45,135,225,315],"offset":{"x":12,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[2],"propeller":false,"angle":0},"thingydetailsinbetween2":{"section_segments":[45,135,225,315],"offset":{"x":23,"y":45,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":180},"thingydetailsinbetween2_insider":{"section_segments":[45,135,225,315],"offset":{"x":21,"y":45,"z":23.5},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[2],"propeller":false,"angle":180},"thingydetailsinbetween2sider":{"section_segments":[45,135,225,315],"offset":{"x":19,"y":45,"z":25},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":180},"engineDetailTop":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":83.5,"z":30},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,15,15,15],"z":[-5.5,-5.5,-5.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Far":{"section_segments":[45,135,225,315],"offset":{"x":17,"y":83.5,"z":23.4},"position":{"x":[3,3,3,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-3,-3,-3,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Farther":{"section_segments":[45,135,225,315],"offset":{"x":24.8,"y":83.5,"z":10},"position":{"x":[5.5,5.5,5.5,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_M":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":13.5,"z":30},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_M_Fer":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-45,"z":21},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[8,8,8,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SF":{"section_segments":[45,135,225,315],"offset":{"x":18.5,"y":9,"z":24},"position":{"x":[0,0,0,0,0,0],"y":[-13,-13,-13,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MF":{"section_segments":[45,135,225,315],"offset":{"x":14.4,"y":-14,"z":24},"position":{"x":[-3.3,-3.3,-3.3,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MFer":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":-45,"z":17},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[7,7,7,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MFer_B":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":-45,"z":3},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[-7,-7,-7,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFer":{"section_segments":[45,135,225,315],"offset":{"x":15,"y":-45,"z":9.99},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[-14,-14,-14,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_T":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-90,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[10,10,10,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_B":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-90,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[-10,-10,-10,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_TS":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[11.5,11.5,11.5,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[7.5,7.5,7.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_BS":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[11.5,11.5,11.5,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[-7.5,-7.5,-7.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-30,10,30,40],"z":[0,0,2,2,2]},"width":[0,10,16,15,5],"height":[0,9,12.5,12.5,2.5],"propeller":false,"texture":9},"deco":{"section_segments":8,"offset":{"x":23,"y":10,"z":10},"position":{"x":[1,1,3,7.5,10,10,10],"y":[-45,-50,-20,0,20,70,65],"z":[0,0,0,0,0,0,0]},"width":[0,7,10,10,15,10,0],"height":[0,7,10,10,10,8,0],"angle":0,"propeller":true,"texture":[4,3,4,10,4,17]},"top_props":{"section_segments":12,"offset":{"x":33,"y":30,"z":20},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[-5,-5,-1,0,0,1,1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"bottom_props":{"section_segments":12,"offset":{"x":33,"y":30,"z":0},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[5,5,1,0,0,-1,-1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"disc1":{"section_segments":20,"offset":{"x":33,"y":31.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc2":{"section_segments":20,"offset":{"x":33,"y":41.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[7]},"disc3":{"section_segments":20,"offset":{"x":33,"y":51.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"bottomdisc1":{"section_segments":20,"offset":{"x":33,"y":31.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"bottomdisc2":{"section_segments":20,"offset":{"x":33,"y":41.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[7]},"bottomddisc3":{"section_segments":20,"offset":{"x":33,"y":51.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc1_1":{"section_segments":8,"offset":{"x":0,"y":81,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[13]},"disc2_2":{"section_segments":8,"offset":{"x":0,"y":88,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,0.2,0.2,0.2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[17]},"disc3_3":{"section_segments":8,"offset":{"x":0,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[25,26,25,27,27,27,27,25,25,25],"height":[19,19,19,22,22,22,22,19,19,19],"texture":[13]},"disc4":{"section_segments":8,"offset":{"x":0,"y":-31,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[20,20,20,22,22,22,22,20,20,20],"height":[19,19,19,21,21,21,21,19,19,19],"texture":[13]},"disc5":{"section_segments":8,"offset":{"x":0,"y":-86,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[14,14,14,16,16,16,16,14,14,14],"height":[10,10,10,12,12,12,12,10,10,10],"texture":[13]},"disc6":{"section_segments":8,"offset":{"x":0,"y":-99.7,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[1,1,1,2,2,2,2,1,1,1],"height":[1,1,1,2,2,2,2,1,1,1],"texture":[13]}},"wings":{"top":{"length":[50,40],"width":[80,50,30],"angle":[5,120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"topdetails":{"length":[55],"width":[80,50],"angle":[0],"position":[30,55],"doubleside":true,"bump":{"position":30,"size":5},"texture":[17],"offset":{"x":15,"y":-18,"z":10}},"bottom":{"length":[50,40],"width":[80,50,30],"angle":[-5,-120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"connectors":{"length":[10],"width":[50,50],"angle":[90],"position":[0,0],"doubleside":true,"bump":{"position":30,"size":6},"texture":[11],"offset":{"x":71,"y":40,"z":6}}},"typespec":{"name":"V2","level":1,"model":3,"code":103,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3,2.876,2.529,1.764,1.42,1.518,1.47,1.337,1.246,1.179,1.217,1.369,1.589,1.95,2.199,2.29,2.447,2.691,2.888,2.872,2.93,2.956,2.652,2.713,2.694,2.651,2.694,2.713,2.652,2.956,2.93,2.872,2.888,2.691,2.447,2.29,2.199,1.95,1.605,1.369,1.217,1.179,1.246,1.337,1.47,1.518,1.42,1.764,2.529,2.876],"lasers":[],"radius":3,"next":[]}}';

var RAD_Diamond_Lancer_104 = '{"name":"RAD Diamond Lancer","designer":"Uranus","level":1,"model":4,"size":1.98,"zoom":0.69,"next":[],"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":6,"offset":{"x":0,"y":-50,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-53,-50,-40,-20,10,40,80,84],"z":[0,0,0,0,0,0,0,0]},"width":[18,25,25,23,23,25,20,0],"height":[0,5,10,10,10,10,7,0],"texture":[1,1,1,1,1,8,3.9],"angle":0},"bumper":{"section_segments":6,"offset":{"x":-1,"y":-100,"z":0},"position":{"x":[1.5,1,0,-5,-5,0,0],"y":[0,10,15,25,27],"z":[0,0,0,0,0,0,0]},"width":[5,5,5,5,0],"height":[5,5,5,5,0],"texture":[3.9,16.9,3.9],"angle":90},"cockpitWindshield":{"section_segments":3,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[-20,0,5,0,-20,0,0],"y":[-20,-10,0,10,20],"z":[-6,-2,0,-2,-6,0,0]},"width":[0,12,12,12,0],"height":[0,5,5,5,0],"texture":[8.6],"angle":90},"cockpitBack":{"section_segments":6,"offset":{"x":0,"y":10,"z":7},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-20,0,20,23],"z":[-2,0,0,0,0,0,0]},"width":[15,15,15,13,0],"height":[0,10,10,10,0],"texture":[4,10,17.9,3.9],"angle":0},"cockpitBackSides":{"section_segments":6,"offset":{"x":13,"y":0,"z":7},"position":{"x":[5,0,0,0,0,0,0],"y":[-20,-10,0,3],"z":[-3,0,0,0,0,0,0]},"width":[0,7,7,0],"height":[0,5,5,0],"texture":[4,17.5,4,3],"angle":0},"enginesTop":{"section_segments":6,"offset":{"x":12,"y":70,"z":7},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesBottom":{"section_segments":6,"offset":{"x":18,"y":65,"z":-5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-54,-50,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,17.9,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesConnect":{"section_segments":6,"offset":{"x":1,"y":36,"z":0},"position":{"x":[4,-12,0,0,0,0,0],"y":[-20,10],"z":[-5,8,0,0,0,0,0]},"width":[2,2],"height":[2,2],"texture":[1.9],"angle":90},"boostTank":{"section_segments":12,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[-30,-30,-30,-30,-30,-30,-30,-30,-30,-30],"y":[-30,-30,-26,-20,-5,5,20,26,30,30],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7.5,8,8,8,8,7.5,5,0],"height":[0,5,7.5,8,8,8,8,7.5,5,0],"texture":[63,63,63,13,4,13,63,63,63],"angle":0},"boostTankHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-44,-43,-39,-38,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,4,4],"height":[0,4,6,4,4],"texture":[4,63,4,4,4,4,4,63,4]},"boostPipeMain":{"section_segments":6,"offset":{"x":0,"y":-20,"z":11},"position":{"x":[-30,-30,-30,-30,-27,-15,-15,0,0],"y":[-20,-18,-15,30,35,45,48],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostPipeSide":{"section_segments":6,"offset":{"x":0,"y":-20,"z":9},"position":{"x":[-34,-34,-34,-34,-36,-40,-42,-42,-42],"y":[-20,-18,-15,25,30,33,40,46],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostTankEngineHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":27,"z":3},"position":{"x":[0,0,0,0,10,0,0,0,0],"y":[-54,-53,-49,-48,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,3,3],"height":[0,4,6,3,3],"texture":[4,63,4,4,4,4,4,63,4]},"engineBoostTankOffset":{"section_segments":6,"offset":{"x":0,"y":70,"z":3},"position":{"x":[-42,-42,-42,-42,-42,-42,-42,-42,-42],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"logo1":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":0},"logo2":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":120},"logo3":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,-3,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":60},"logo4":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,0,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":180},"logoDeco":{"section_segments":4,"offset":{"x":5,"y":-72,"z":9},"position":{"x":[0,0,3,5,8,13,14,15],"y":[-20,-10,2,5,8,14,20,26],"z":[-4,0,-1,-1,-1,-2,-3,-3,0]},"width":[3,3,3,3,3,3,2,0,0],"height":[2,2,2,2,2,1,0,0],"texture":[3.9],"angle":0}},"wings":{"cockpitTop":{"doubleside":false,"offset":{"x":0,"y":-30,"z":15},"length":[10,13],"width":[30,20,4],"angle":[-11,-42],"position":[0,0,11],"texture":[11.5,9],"bump":{"position":20,"size":3}},"cockpitTopBack":{"doubleside":false,"offset":{"x":0,"y":-17,"z":14.8},"length":[10,13],"width":[10,10,20],"angle":[-11,-42],"position":[0,0,10],"texture":[4],"bump":{"position":20,"size":3}},"wingsBackTop":{"doubleside":true,"offset":{"x":14,"y":37,"z":10},"length":[20],"width":[20,7],"angle":[20],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}},"wingsBackBottom":{"doubleside":true,"offset":{"x":20,"y":31,"z":-8},"length":[30],"width":[16,4],"angle":[-25],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}}},"typespec":{"name":"RAD Diamond Lancer","level":1,"model":4,"code":104,"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.191,4.186,4.097,2.552,1.844,1.499,1.287,1.14,1.042,0.973,0.913,0.862,0.83,0.814,0.816,0.838,1.041,1.176,1.305,2.81,2.563,2.725,2.441,2.548,2.499,1.795,2.499,2.548,2.441,2.907,3.086,2.967,2.517,2.456,2.419,2.045,1.873,1.516,1.517,1.768,1.855,1.881,1.858,2.061,2.234,2.258,2.11,2.552,4.097,4.186],"lasers":[],"radius":4.191,"next":[]}}';

var Vengar_105 = '{"name":"Vengar","designer":"SChickenman","level":1,"model":5,"size":1.6,"zoom":0.75,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-72,-70,-45,-25,-10,20,30,45,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,5,10,13,15,15,10,7,0],"height":[0,5,10,13,15,15,10,7,0],"texture":[3,3,63,63,3,11,63,3],"propeller":true},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-15,"z":3},"position":{"x":[0,0,0,0,0,0],"y":[-45,-40,-25,20,45],"z":[0,0,0,10,5,10]},"width":[0,5,8,8,0],"height":[0,5,8,8,0],"texture":[3,3,9,3,3]},"cannon":{"section_segments":12,"offset":{"x":0,"y":-15,"z":-20},"position":{"x":[0,0,0,0,0,0],"y":[-75,-80,-20,0,20,60],"z":[0,0,0,-5,0,20]},"width":[0,10,15,40,35,0],"height":[0,7,10,10,10,0],"angle":0,"propeller":false,"texture":[6,4,4,3]},"cannons2":{"section_segments":12,"offset":{"x":40,"y":70,"z":0},"position":{"x":[0,0,0,0,0],"y":[-30,-20,0,20,30],"z":[0,0,0,0,0]},"width":[2,5,7,10,3],"height":[2,5,7,10,3],"texture":[6,4,63,4],"propeller":true,"angle":0},"propulsors":{"section_segments":8,"offset":{"x":60,"y":-50,"z":-25},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[30,55,60,80,95,100,90,95],"z":[0,0,0,0,0,0,0,0]},"width":[7,9,9,5,7,5,0],"height":[1,9,9,5,7,5,0],"texture":[4,63,4,11,63,12],"propeller":true}},"wings":{"wings1":{"doubleside":true,"offset":{"x":0,"y":20,"z":13},"length":[-20,-10,-40],"width":[50,50,130,30],"angle":[100,-20,10],"position":[0,0,-50,0],"texture":[4,4,8,4],"bump":{"position":10,"size":-10}},"join":{"doubleside":true,"offset":{"x":0,"y":10,"z":0},"length":[70],"width":[50,30],"angle":[-20],"position":[0,0,0,50],"texture":63,"bump":{"position":10,"size":15}},"side_joins":{"offset":{"x":0,"y":30,"z":-3},"length":[40],"width":[90,30],"angle":[10],"position":[-50,50],"texture":[4],"bump":{"position":10,"size":10}}},"typespec":{"name":"Vengar","level":1,"model":5,"code":105,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[550,550],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3.046,3.057,2.411,2.021,1.77,1.594,1.466,1.38,1.329,1.352,2.237,2.221,2.195,2.225,2.231,2.264,2.403,2.605,2.624,2.284,2.851,3.413,3.483,1.97,1.457,1.443,1.457,1.97,3.483,3.413,2.851,2.284,2.624,2.605,2.403,2.264,2.231,2.225,2.195,2.221,2.237,1.352,1.329,1.38,1.466,1.594,1.77,2.021,2.411,3.057],"lasers":[],"radius":3.483,"next":[]}}';

var Space_Phantom_106 = '{"name":"Space Phantom","level":1,"model":6,"size":1,"designer":"Goldman","zoom":0.8,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,290],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[500,500],"acceleration":[150,150],"initial_energy":[60,60],"energy":[100,100]}}},"bodies":{"detail1":{"section_segments":[45,135,225,-90,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[1,1,1,1,1,1,1,18,23,27,32,32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail2":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[-1,-1,-1,-1,-1,-1,-1,-18,-23,-27,-32,-32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail3":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":-15,"z":122},"position":{"x":[0,0,0,0,0,0],"y":[-8,-8,-4,2,5,5],"z":[0,0,0,0,-3,-3]},"width":[0,23,23,20,10,0],"height":[0,40,40,35,15,0],"texture":[1,1,63,4],"propeller":false,"vertical":true,"angle":0},"detail4":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-50,"z":-12},"position":{"x":[0,0,0,0,0,0,0,0,0,20,29,29],"y":[-79,-79,-65,-50,-35,-25,-15,-5,15,42,65,65],"z":[-6,-6,-6,-1,0,0,0,-2,-3.5,2,2,2]},"width":[0,13,31,33,30,26,26,30,32,5,3,0],"height":[0,4,10,22,22,22,25,25,25,15,3,0],"texture":[4],"propeller":false,"vertical":false,"angle":0},"detail5":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,-2,0,0,0],"y":[-60,-60,-20,15,50,50],"z":[0,0,0,0,0,0]},"width":[0,21,26,20,18,0],"height":[0,24,13,12,12,0],"texture":[4,4,4,11.1,4],"propeller":false,"vertical":false,"angle":0},"detail6":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,0,-2,0,0],"y":[-50,-50,-15,20,60,60],"z":[0,0,0,0,0,0]},"width":[0,18,20,26,21,0],"height":[0,12,12,13,24,0],"texture":[4,11.1,4,4,4],"propeller":false,"vertical":false,"angle":180},"detail7":{"section_segments":6,"offset":{"x":1,"y":-100,"z":9},"position":{"x":[-1,-1,-1,-1,-1,13,14,13,13],"y":[-50,-50,-35,-15,5,20,50,70,70],"z":[-25,-25,-23,-9,-2,0,0,-3,-3]},"width":[0,7,15,20,22,6,3,2,0],"height":[0,2,15,12,8,2,2,2,0],"texture":[9,9,9,9,7,4],"propeller":false,"vertical":false,"angle":0},"detail8":{"section_segments":8,"offset":{"x":40,"y":100,"z":-15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-50,-40,-10,40,50,40,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,12,15,15,15,12,5,0],"height":[0,12,15,15,15,12,5,0],"texture":[4,4,15,4,4,17],"propeller":true,"vertical":false,"angle":0},"detail9":{"section_segments":[45,135,225,315],"offset":{"x":55,"y":-15,"z":-85},"position":{"x":[-7,-7,-3,0,0,-7,-7],"y":[-12,-12,-9,-6,1.5,15,15],"z":[0,0,0,-2,-25,-35,-45]},"width":[0,4,4,4,4,4,0],"height":[0,44,48,49,20,16,0],"texture":[1],"propeller":false,"vertical":true,"angle":0},"detail10":{"section_segments":6,"offset":{"x":49,"y":45,"z":-18},"position":{"x":[-3,-3,0,0,0,0],"y":[-25,-25,-20,20,25,25],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[1,1,63,1],"propeller":false,"vertical":false,"angle":0},"detail11":{"section_segments":[45,135,225,315],"offset":{"x":45,"y":-15,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[0,0,-41,-40,-28,40,40],"z":[0,0,0,0,0,0,0]},"width":[0,2,2,3.5,3.5,3.5,0],"height":[0,2,2,3.5,3.5,3.5,0],"texture":[4,4,4,8,4],"propeller":false,"vertical":false,"angle":0},"detail12":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,-40,-55,-55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":90},"detail13":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,40,55,55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":-90},"detail14":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":0,"z":-110},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-6,-6,-4,2,5,-2,-2,-2],"z":[0,0,0,0,-3,-3,-3,-3,-3]},"width":[0,40,40,35,20,25,16,0],"height":[0,40,40,35,20,25,16,0],"texture":[0.9,0.9,63,0.9,3.9,16.9,3.9],"propeller":false,"vertical":true,"angle":0},"detail15":{"section_segments":6,"offset":{"x":0,"y":140,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-50,-8,15,30,20,20],"z":[0,0,0,0,0,0,0]},"width":[0,25,25,25,18,8,0],"height":[0,16,15,15,12,5,0],"texture":[3.9,3.9,12.9,3.9,16.9],"propeller":true,"vertical":false,"angle":0},"detail16":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-63,"z":4},"position":{"x":[0,0,0,0,0],"y":[-25,-25,-20,30,30],"z":[0,0,0,0,0]},"width":[0,17,17,17,0],"height":[0,6,6,6,0],"texture":[1,1,10.4444,1],"propeller":false,"vertical":false,"angle":0},"detail17":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":10,"z":3},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-30,-20,30,40,70,70],"z":[0,0,0,-8,-8,-8,-8]},"width":[0,12,17,17,10,10,0],"height":[0,6,6,12,6,6,0],"texture":[3,3,8,63,15,3],"propeller":false,"vertical":false,"angle":0},"detail18":{"section_segments":6,"offset":{"x":58,"y":100,"z":-29},"position":{"x":[0,0,0,0,0,0],"y":[-35,-35,-30,30,35,35],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[3.9,3.9,11,3.9,3.9],"propeller":false,"vertical":false,"angle":0},"detail19":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-150,"z":-20},"position":{"x":[0,0,0,0,0,0],"y":[-10,-10,-13,-10,15,15],"z":[0,0,0,0,0,0]},"width":[0,5,7,10,10,0],"height":[0,1,2,4,4,0],"texture":[4,4,1,15],"propeller":false,"vertical":false,"angle":0}},"typespec":{"name":"Space Phantom","level":1,"model":6,"code":106,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,290],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[500,500],"acceleration":[150,150],"initial_energy":[60,60],"energy":[100,100]}}},"shape":[3.262,3.138,2.418,1.682,1.217,1.453,1.455,1.302,1.17,1.083,1.019,0.978,0.956,0.957,0.98,1.017,1.275,1.382,1.584,2.817,3.976,3.77,3.175,3.154,3.414,3.407,3.414,3.154,3.175,3.77,3.976,2.817,1.584,1.382,1.275,1.017,0.98,0.957,0.956,0.978,1.019,1.083,1.17,1.302,1.455,1.453,1.217,1.682,2.418,3.138],"lasers":[],"radius":3.976,"next":[]}}';


// Endurance ships

var Booster_201 = '{"name":"Booster","level":2,"model":1,"size":1.62,"zoom":0.75,"designer":"Zerd","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[450,450],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main1":{"section_segments":12,"offset":{"x":57,"y":-55,"z":-11},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-55,-33,-40,0,10,40,48,66,77,67],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,6,15,20,14,14,20,20,15,0],"height":[0,6,15,20,14,14,20,20,15,0],"propeller":true,"texture":[4,18,10,63,8,63,11,12,17]},"main2":{"section_segments":12,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-60,-50,-20,10,15,45,75,60],"z":[-7,-7,-5,0,0,0,0,0,0]},"width":[0,8,15,25,25,20,20,14,0],"height":[0,6,10,15,18,18,18,14,0],"propeller":true,"texture":[12,63,10,1,5,8,12,17]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-48,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[-5,10,30,60],"z":[-20,-8,0,0]},"width":[5,8,12,5],"height":[4,10,10,5],"propeller":false,"texture":[7,9,4,4]},"cannons":{"section_segments":6,"offset":{"x":20,"y":30,"z":15},"position":{"x":[0,0,0,0,0,0],"y":[-60,-70,-30,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]},"cannons2":{"section_segments":6,"offset":{"x":27,"y":0,"z":-5},"position":{"x":[0,0,0,0,0,0],"y":[-70,-80,-35,0,25,30],"z":[0,0,0,0,0,0]},"width":[0,5,6,11,7,0],"height":[0,5,6,11,7,0],"angle":180,"texture":[3,8,10,63]}},"wings":{"main1":{"length":[20,20],"width":[50,30,15],"angle":[-10,-15],"position":[0,-20,-11],"doubleside":true,"offset":{"x":20,"y":-12,"z":5},"bump":{"position":35,"size":15},"texture":[11,63]},"main2":{"length":[30],"width":[33,15],"angle":[-20],"position":[0,20],"doubleside":true,"offset":{"x":65,"y":-33,"z":-9},"bump":{"position":30,"size":15},"texture":[8]}},"typespec":{"name":"Booster","level":2,"model":1,"code":101,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":250,"speed":[290,290],"rotation":[60,60],"acceleration":[120,120],"dash":{"rate":2,"burst_speed":[250,250],"speed":[450,450],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[1.948,1.961,1.851,3.401,4.014,3.862,3.697,3.331,3.078,2.845,3.025,3.092,3.043,2.514,2.52,2.456,1.934,1.339,1.449,1.627,1.918,2.398,2.784,3.335,3.298,2.435,3.298,3.335,2.784,2.398,1.918,1.627,1.449,1.339,1.934,2.456,2.52,2.514,3.043,3.092,3.025,2.845,3.078,3.331,3.697,3.862,4.014,3.401,1.851,1.961],"lasers":[],"radius":4.014,"next":[]}}';

var Astral_Accelerator_202 = '{"name":"Astral Accelerator","level":2,"model":2,"size":1.5,"zoom":0.75,"designer":"Finalizer","next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":10,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-90,-93,-95,-90,-30,0,50,100,105],"z":[-7,-7,-7,-7,-7,-7,0,0,0]},"width":[20,23,25,27,30,27,30,26,0],"height":[0,6,8,10,15,18,8,10,0],"texture":[17,13,63,1,10,1,10,12]},"stripes":{"section_segments":16,"offset":{"x":15,"y":-40,"z":10},"position":{"x":[-4,-4,-4,11,5,0,0,0],"y":[-92,-30,0,50,100],"z":[1,6,10,3,3,0]},"width":[3,3,3,3,3,3],"height":[1,1,1,1,1],"texture":[63]},"cockpit":{"section_segments":10,"offset":{"x":0,"y":-20,"z":17},"position":{"x":[0,0,0,0,0,0],"y":[10,30,40,70,80],"z":[-2,0,0,0,0]},"width":[7.5,10,10,9.5,0],"height":[3,10,11,10,0],"texture":[9,4,13,4],"propeller":false},"detail":{"section_segments":8,"angle":3,"offset":{"x":26,"y":-50,"z":6},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,3,7,11,14,17,21,25,28,31,35,39,42,45,49,53,57],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[1,4,6,4,1,4,6,4,1,4,6,4,1,4,6,4,1],"height":[1,4,6,4,1,4,6,4,1,4,6,4,1,4,6,4,1],"texture":[4,17,17,4,4,17,17,4,4,17,17,4,4,17,17,4]},"engine":{"section_segments":4,"offset":{"x":0,"y":-95,"z":18},"position":{"x":[0,0,0,0],"y":[-18,-15,15,18],"z":[0,0,0,0]},"width":[0,10,10,0],"height":[0,4,4,0],"texture":[18]},"bracings1":{"section_segments":8,"angle":90,"offset":{"x":0,"y":-85,"z":18},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-15,-14,-11.5,-10,-8,0,8,10,11.5,14,15],"z":[-20,-10,-1,1,2,0,2,1,-1,-10,-20]},"width":[4,4,4,4,4,5,4,4,4,4,4],"height":[0,10,4,3,2,3,2,3,4,10,0],"propeller":false,"texture":[13]},"bracings2":{"section_segments":8,"angle":90,"offset":{"x":0,"y":-105,"z":18},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-15,-14,-11.5,-10,-8,0,8,10,11.5,14,15],"z":[-20,-10,-1,1,2,0,2,1,-1,-10,-20]},"width":[4,4,4,4,4,5,4,4,4,4,4],"height":[0,10,4,3,2,3,2,3,4,10,0],"propeller":false,"texture":[13]},"engines":{"section_segments":12,"offset":{"x":18,"y":0,"z":15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[25,20,25,40,75,70,65],"z":[5,0,0,0,0,0,0,0]},"width":[0,5,7,8,8,6,0],"height":[0,14,15,15,13,10,0],"texture":[13,1,63,10,18,17],"propeller":true}},"wings":{"main":{"length":[46,0,25,-25,20],"width":[100,20,70,0,70,10],"angle":[10,0,110,110,-70],"position":[-30,5,-10,30,-10,20],"texture":[18,11,63],"doubleside":true,"bump":{"position":30,"size":7},"offset":{"x":0,"y":30,"z":0}},"font":{"length":[45],"width":[61,10],"angle":[-6,20],"position":[-60,-100],"texture":[63],"doubleside":true,"bump":{"position":30,"size":20},"offset":{"x":0,"y":-20,"z":5}}},"typespec":{"name":"Astral Accelerator","level":2,"model":2,"code":102,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":200,"speed":[310,310],"rotation":[70,70],"acceleration":[90,90],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.058,4.112,4.016,3.983,1.924,1.681,1.362,1.335,1.111,1.114,1.432,1.413,1.408,1.442,1.495,1.584,1.707,1.9,2.145,2.274,2.14,2.112,2.381,2.366,2.29,1.95,2.29,2.366,2.381,2.112,2.14,2.274,2.145,1.9,1.707,1.584,1.495,1.442,1.41,1.413,1.432,1.114,1.111,1.335,1.362,1.681,1.924,3.983,4.016,4.112],"lasers":[],"radius":4.112,"next":[]}}'; 

var V2_203 = '{"name":"V2","designer":"Void","level":2,"model":3,"size":1.5,"zoom":0.7,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-75,-20,0,45,76,95,85],"z":[0,0,0,0,0,0,0,0]},"width":[0,15,20,25,25,25,20,0],"height":[0,10,20,20,20,20,15,0],"propeller":true,"texture":[63,2,2,10,2,4,17],"vertical":false},"topDetail":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":48,"z":29.8},"position":{"x":[3,-2,3,-2,4,1,-2],"y":[-30,-10,-10,5,5,15,15],"z":[0,0,0,0,0,0,0]},"width":[0,6,6,7,8,9,0],"height":[0,1,1,1,1,1,0],"propeller":false,"texture":[63],"angle":0,"vertical":false},"backDetailbottom":{"section_segments":[45,135,225,315],"offset":{"x":-57,"y":35,"z":6},"position":{"x":[5,0,5,0,6,3,0],"y":[-35,-15,-15,5,5,15,15],"z":[0,0,0,0,0,0,0]},"width":[0,6,6,7,8,9,0],"height":[0,2,2,2,2,2,0],"propeller":false,"texture":[3],"angle":-5},"hundredpercentlegitname":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":20,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":90},"hundredpercentlegitname2":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":65,"z":29},"position":{"x":[-5,-5,0,0,-5,-5],"y":[-25,-25,-15,15,25,25],"z":[-8,-8,-2,-2,-8,-8]},"width":[0,2,5,5,2,0],"height":[0,3,5,5,3,0],"texture":[4,4,3,4,4],"propeller":false,"angle":-90},"thingydetailsinbetween":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":0},"thingydetailsinbetweensider":{"section_segments":[45,135,225,315],"offset":{"x":14,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":0},"thingydetailsinbetween_insider":{"section_segments":[45,135,225,315],"offset":{"x":12,"y":42.5,"z":29},"position":{"x":[0,0,0,0,0,0],"y":[-25,-25,-25,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[2],"propeller":false,"angle":0},"thingydetailsinbetween2":{"section_segments":[45,135,225,315],"offset":{"x":23,"y":45,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":180},"thingydetailsinbetween2_insider":{"section_segments":[45,135,225,315],"offset":{"x":21,"y":45,"z":23.5},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[2],"propeller":false,"angle":180},"thingydetailsinbetween2sider":{"section_segments":[45,135,225,315],"offset":{"x":19,"y":45,"z":25},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,20,20,20],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[17],"propeller":false,"angle":180},"engineDetailTop":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":83.5,"z":30},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,15,15,15],"z":[-5.5,-5.5,-5.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Far":{"section_segments":[45,135,225,315],"offset":{"x":17,"y":83.5,"z":23.4},"position":{"x":[3,3,3,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-3,-3,-3,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"engineDetailSides_Farther":{"section_segments":[45,135,225,315],"offset":{"x":24.8,"y":83.5,"z":10},"position":{"x":[5.5,5.5,5.5,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_M":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":13.5,"z":30},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_M_Fer":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-45,"z":21},"position":{"x":[0,0,0,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[8,8,8,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SF":{"section_segments":[45,135,225,315],"offset":{"x":18.5,"y":9,"z":24},"position":{"x":[0,0,0,0,0,0],"y":[-13,-13,-13,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MF":{"section_segments":[45,135,225,315],"offset":{"x":14.4,"y":-14,"z":24},"position":{"x":[-3.3,-3.3,-3.3,0,0,0],"y":[-4,-4,-4,17,17,17],"z":[-0.2,-0.2,-0.2,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MFer":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":-45,"z":17},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[7,7,7,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_MFer_B":{"section_segments":[45,135,225,315],"offset":{"x":10,"y":-45,"z":3},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[-7,-7,-7,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFer":{"section_segments":[45,135,225,315],"offset":{"x":15,"y":-45,"z":9.99},"position":{"x":[-5,-5,-5,0,0,0],"y":[-15,-15,-15,40,40,40],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[-14,-14,-14,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[0,0,0,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_T":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-90,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[10,10,10,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_B":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-90,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[-10,-10,-10,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_TS":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[11.5,11.5,11.5,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[7.5,7.5,7.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"EDF_SFest_BS":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-90,"z":10},"position":{"x":[11.5,11.5,11.5,0,0,0],"y":[-4,-4,-4,10,10,10],"z":[-7.5,-7.5,-7.5,0,0,0]},"width":[0,1,1,1,1,0],"height":[0,1,1,1,1,0],"texture":[3],"propeller":false,"angle":180},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-30,10,30,40],"z":[0,0,2,2,2]},"width":[0,10,16,15,5],"height":[0,9,12.5,12.5,2.5],"propeller":false,"texture":9},"deco":{"section_segments":8,"offset":{"x":23,"y":10,"z":10},"position":{"x":[1,1,3,7.5,10,10,10],"y":[-45,-50,-20,0,20,70,65],"z":[0,0,0,0,0,0,0]},"width":[0,7,10,10,15,10,0],"height":[0,7,10,10,10,8,0],"angle":0,"propeller":true,"texture":[4,3,4,10,4,17]},"top_props":{"section_segments":12,"offset":{"x":33,"y":30,"z":20},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[-5,-5,-1,0,0,1,1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"bottom_props":{"section_segments":12,"offset":{"x":33,"y":30,"z":0},"position":{"x":[-6,-6,-3,0,0,0,0],"y":[-30,-40,-20,0,30,45,43],"z":[5,5,1,0,0,-1,-1]},"width":[0,5,6,10,10,7.5,0],"height":[0,5,5,5,5,4,0],"angle":0,"propeller":true,"texture":[4,4,10,4,63,17]},"disc1":{"section_segments":20,"offset":{"x":33,"y":31.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc2":{"section_segments":20,"offset":{"x":33,"y":41.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[7]},"disc3":{"section_segments":20,"offset":{"x":33,"y":51.5,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"bottomdisc1":{"section_segments":20,"offset":{"x":33,"y":31.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"bottomdisc2":{"section_segments":20,"offset":{"x":33,"y":41.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[7]},"bottomddisc3":{"section_segments":20,"offset":{"x":33,"y":51.5,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[11,11,11,12,12,12,12,11,11,11],"height":[11,11,11,12,12,12,12,11,11,11],"texture":[8]},"disc1_1":{"section_segments":8,"offset":{"x":0,"y":81,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,7,7,7,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[13]},"disc2_2":{"section_segments":8,"offset":{"x":0,"y":88,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,0.2,0.2,0.2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[19,19,19,20,20,20,20,19,19,19],"height":[14,14,14,15,15,15,15,14,14,14],"texture":[17]},"disc3_3":{"section_segments":8,"offset":{"x":0,"y":-10,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[25,26,25,27,27,27,27,25,25,25],"height":[19,19,19,22,22,22,22,19,19,19],"texture":[13]},"disc4":{"section_segments":8,"offset":{"x":0,"y":-31,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[20,20,20,22,22,22,22,20,20,20],"height":[19,19,19,21,21,21,21,19,19,19],"texture":[13]},"disc5":{"section_segments":8,"offset":{"x":0,"y":-86,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[14,14,14,16,16,16,16,14,14,14],"height":[10,10,10,12,12,12,12,10,10,10],"texture":[13]},"disc6":{"section_segments":8,"offset":{"x":0,"y":-99.7,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,2,2,2,0,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[1,1,1,2,2,2,2,1,1,1],"height":[1,1,1,2,2,2,2,1,1,1],"texture":[13]}},"wings":{"top":{"length":[50,40],"width":[80,50,30],"angle":[5,120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"topdetails":{"length":[55],"width":[80,50],"angle":[0],"position":[30,55],"doubleside":true,"bump":{"position":30,"size":5},"texture":[17],"offset":{"x":15,"y":-18,"z":10}},"bottom":{"length":[50,40],"width":[80,50,30],"angle":[-5,-120],"position":[30,50,80],"doubleside":true,"bump":{"position":30,"size":7},"texture":[11,63],"offset":{"x":20,"y":-10,"z":10}},"connectors":{"length":[10],"width":[50,50],"angle":[90],"position":[0,0],"doubleside":true,"bump":{"position":30,"size":6},"texture":[11],"offset":{"x":71,"y":40,"z":6}}},"typespec":{"name":"V2","level":2,"model":3,"code":203,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":220,"speed":[305,305],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3,2.876,2.529,1.764,1.42,1.518,1.47,1.337,1.246,1.179,1.217,1.369,1.589,1.95,2.199,2.29,2.447,2.691,2.888,2.872,2.93,2.956,2.652,2.713,2.694,2.651,2.694,2.713,2.652,2.956,2.93,2.872,2.888,2.691,2.447,2.29,2.199,1.95,1.605,1.369,1.217,1.179,1.246,1.337,1.47,1.518,1.42,1.764,2.529,2.876],"lasers":[],"radius":3,"next":[]}}';

var RAD_Diamond_Lancer_204 = '{"name":"RAD Diamond Lancer","designer":"Uranus","level":2,"model":4,"size":1.98,"zoom":0.69,"next":[],"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":6,"offset":{"x":0,"y":-50,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-53,-50,-40,-20,10,40,80,84],"z":[0,0,0,0,0,0,0,0]},"width":[18,25,25,23,23,25,20,0],"height":[0,5,10,10,10,10,7,0],"texture":[1,1,1,1,1,8,3.9],"angle":0},"bumper":{"section_segments":6,"offset":{"x":-1,"y":-100,"z":0},"position":{"x":[1.5,1,0,-5,-5,0,0],"y":[0,10,15,25,27],"z":[0,0,0,0,0,0,0]},"width":[5,5,5,5,0],"height":[5,5,5,5,0],"texture":[3.9,16.9,3.9],"angle":90},"cockpitWindshield":{"section_segments":3,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[-20,0,5,0,-20,0,0],"y":[-20,-10,0,10,20],"z":[-6,-2,0,-2,-6,0,0]},"width":[0,12,12,12,0],"height":[0,5,5,5,0],"texture":[8.6],"angle":90},"cockpitBack":{"section_segments":6,"offset":{"x":0,"y":10,"z":7},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-20,0,20,23],"z":[-2,0,0,0,0,0,0]},"width":[15,15,15,13,0],"height":[0,10,10,10,0],"texture":[4,10,17.9,3.9],"angle":0},"cockpitBackSides":{"section_segments":6,"offset":{"x":13,"y":0,"z":7},"position":{"x":[5,0,0,0,0,0,0],"y":[-20,-10,0,3],"z":[-3,0,0,0,0,0,0]},"width":[0,7,7,0],"height":[0,5,5,0],"texture":[4,17.5,4,3],"angle":0},"enginesTop":{"section_segments":6,"offset":{"x":12,"y":70,"z":7},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesBottom":{"section_segments":6,"offset":{"x":18,"y":65,"z":-5},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-55,-54,-50,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,17.9,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"enginesConnect":{"section_segments":6,"offset":{"x":1,"y":36,"z":0},"position":{"x":[4,-12,0,0,0,0,0],"y":[-20,10],"z":[-5,8,0,0,0,0,0]},"width":[2,2],"height":[2,2],"texture":[1.9],"angle":90},"boostTank":{"section_segments":12,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[-30,-30,-30,-30,-30,-30,-30,-30,-30,-30],"y":[-30,-30,-26,-20,-5,5,20,26,30,30],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7.5,8,8,8,8,7.5,5,0],"height":[0,5,7.5,8,8,8,8,7.5,5,0],"texture":[63,63,63,13,4,13,63,63,63],"angle":0},"boostTankHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":-15,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-44,-43,-39,-38,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,4,4],"height":[0,4,6,4,4],"texture":[4,63,4,4,4,4,4,63,4]},"boostPipeMain":{"section_segments":6,"offset":{"x":0,"y":-20,"z":11},"position":{"x":[-30,-30,-30,-30,-27,-15,-15,0,0],"y":[-20,-18,-15,30,35,45,48],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostPipeSide":{"section_segments":6,"offset":{"x":0,"y":-20,"z":9},"position":{"x":[-34,-34,-34,-34,-36,-40,-42,-42,-42],"y":[-20,-18,-15,25,30,33,40,46],"z":[-6,-2,0,0,0,0,0,0]},"width":[2,2,2,2,2,2,2,0],"height":[2,2,2,2,2,2,2,0],"texture":[63],"angle":0},"boostTankEngineHolder":{"section_segments":6,"angle":90,"offset":{"x":0,"y":27,"z":3},"position":{"x":[0,0,0,0,10,0,0,0,0],"y":[-54,-53,-49,-48,0],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,6,8,3,3],"height":[0,4,6,3,3],"texture":[4,63,4,4,4,4,4,63,4]},"engineBoostTankOffset":{"section_segments":6,"offset":{"x":0,"y":70,"z":3},"position":{"x":[-42,-42,-42,-42,-42,-42,-42,-42,-42],"y":[-60,-58,-55,-40,-30,-25,-20,-8,-30],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,7,7,5,5,8,6,0],"height":[0,5,7,7,5,5,8,6,0],"texture":[3.9,3.9,10.4,63,2.9,2.9,3.9,16.9],"angle":0,"propeller":true},"logo1":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":0},"logo2":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[0,5],"z":[0,0,0,0,0,0,0]},"width":[0,3.2],"height":[0,0],"texture":[4,3,4,3],"angle":120},"logo3":{"section_segments":4,"offset":{"x":0.1,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,-3,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":60},"logo4":{"section_segments":4,"offset":{"x":0,"y":-65,"z":11},"position":{"x":[0,0,0,0,0,0,0],"y":[5,15],"z":[0,0,0,0,0,0,0]},"width":[3.2,0],"height":[0,0],"texture":[4],"angle":180},"logoDeco":{"section_segments":4,"offset":{"x":5,"y":-72,"z":9},"position":{"x":[0,0,3,5,8,13,14,15],"y":[-20,-10,2,5,8,14,20,26],"z":[-4,0,-1,-1,-1,-2,-3,-3,0]},"width":[3,3,3,3,3,3,2,0,0],"height":[2,2,2,2,2,1,0,0],"texture":[3.9],"angle":0}},"wings":{"cockpitTop":{"doubleside":false,"offset":{"x":0,"y":-30,"z":15},"length":[10,13],"width":[30,20,4],"angle":[-11,-42],"position":[0,0,11],"texture":[11.5,9],"bump":{"position":20,"size":3}},"cockpitTopBack":{"doubleside":false,"offset":{"x":0,"y":-17,"z":14.8},"length":[10,13],"width":[10,10,20],"angle":[-11,-42],"position":[0,0,10],"texture":[4],"bump":{"position":20,"size":3}},"wingsBackTop":{"doubleside":true,"offset":{"x":14,"y":37,"z":10},"length":[20],"width":[20,7],"angle":[20],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}},"wingsBackBottom":{"doubleside":true,"offset":{"x":20,"y":31,"z":-8},"length":[30],"width":[16,4],"angle":[-25],"position":[0,20],"texture":[63],"bump":{"position":20,"size":5}}},"typespec":{"name":"RAD Diamond Lancer","level":2,"model":4,"code":104,"specs":{\
"shield":{"capacity":[240,400],"reload":[400,400]},"generator":{"capacity":[240,240],"reload":[19,29]},"ship":{"mass":230,"speed":[300,300],"rotation":[70,70],"acceleration":[95,95],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[4.191,4.186,4.097,2.552,1.844,1.499,1.287,1.14,1.042,0.973,0.913,0.862,0.83,0.814,0.816,0.838,1.041,1.176,1.305,2.81,2.563,2.725,2.441,2.548,2.499,1.795,2.499,2.548,2.441,2.907,3.086,2.967,2.517,2.456,2.419,2.045,1.873,1.516,1.517,1.768,1.855,1.881,1.858,2.061,2.234,2.258,2.11,2.552,4.097,4.186],"lasers":[],"radius":4.191,"next":[]}}';

var Vengar_205 = '{"name":"Vengar","designer":"SChickenman","level":2,"model":5,"size":1.6,"zoom":0.75,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-72,-70,-45,-25,-10,20,30,45,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,5,10,13,15,15,10,7,0],"height":[0,5,10,13,15,15,10,7,0],"texture":[3,3,63,63,3,11,63,3],"propeller":true},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-15,"z":3},"position":{"x":[0,0,0,0,0,0],"y":[-45,-40,-25,20,45],"z":[0,0,0,10,5,10]},"width":[0,5,8,8,0],"height":[0,5,8,8,0],"texture":[3,3,9,3,3]},"cannon":{"section_segments":12,"offset":{"x":0,"y":-15,"z":-20},"position":{"x":[0,0,0,0,0,0],"y":[-75,-80,-20,0,20,60],"z":[0,0,0,-5,0,20]},"width":[0,10,15,40,35,0],"height":[0,7,10,10,10,0],"angle":0,"propeller":false,"texture":[6,4,4,3]},"cannons2":{"section_segments":12,"offset":{"x":40,"y":70,"z":0},"position":{"x":[0,0,0,0,0],"y":[-30,-20,0,20,30],"z":[0,0,0,0,0]},"width":[2,5,7,10,3],"height":[2,5,7,10,3],"texture":[6,4,63,4],"propeller":true,"angle":0},"propulsors":{"section_segments":8,"offset":{"x":60,"y":-50,"z":-25},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[30,55,60,80,95,100,90,95],"z":[0,0,0,0,0,0,0,0]},"width":[7,9,9,5,7,5,0],"height":[1,9,9,5,7,5,0],"texture":[4,63,4,11,63,12],"propeller":true}},"wings":{"wings1":{"doubleside":true,"offset":{"x":0,"y":20,"z":13},"length":[-20,-10,-40],"width":[50,50,130,30],"angle":[100,-20,10],"position":[0,0,-50,0],"texture":[4,4,8,4],"bump":{"position":10,"size":-10}},"join":{"doubleside":true,"offset":{"x":0,"y":10,"z":0},"length":[70],"width":[50,30],"angle":[-20],"position":[0,0,0,50],"texture":63,"bump":{"position":10,"size":15}},"side_joins":{"offset":{"x":0,"y":30,"z":-3},"length":[40],"width":[90,30],"angle":[10],"position":[-50,50],"texture":[4],"bump":{"position":10,"size":10}}},"typespec":{"name":"Vengar","level":2,"model":5,"code":105,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[200,200],"reload":[19,29]},"ship":{"mass":230,"speed":[290,290],"rotation":[95,95],"acceleration":[125,125],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[50,50],"energy":[100,100]}}},"shape":[3.046,3.057,2.411,2.021,1.77,1.594,1.466,1.38,1.329,1.352,2.237,2.221,2.195,2.225,2.231,2.264,2.403,2.605,2.624,2.284,2.851,3.413,3.483,1.97,1.457,1.443,1.457,1.97,3.483,3.413,2.851,2.284,2.624,2.605,2.403,2.264,2.231,2.225,2.195,2.221,2.237,1.352,1.329,1.38,1.466,1.594,1.77,2.021,2.411,3.057],"lasers":[],"radius":3.483,"next":[]}}';

var Space_Phantom_206 = '{"name":"Space Phantom","level":2,"model":6,"size":1,"designer":"Goldman","zoom":0.8,"next":[],"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,290],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[60,60],"energy":[100,100]}}},"bodies":{"detail1":{"section_segments":[45,135,225,-90,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[1,1,1,1,1,1,1,18,23,27,32,32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail2":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":-50,"z":0},"position":{"x":[-1,-1,-1,-1,-1,-1,-1,-18,-23,-27,-32,-32],"y":[-80,-80,-65,-55,-45,-30,20,40,50,60,70,70],"z":[-13,-13,-7,-2,0,0,0,-1,-2,-5,-8,-8]},"width":[0,12,25,27,27,25,25,10,7,6,3,0],"height":[0,3,9,12,11,11,11,11,8,6,3,0],"texture":[1,1,1,1,1,1,1,1,63],"propeller":false,"vertical":false,"angle":0},"detail3":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":-15,"z":122},"position":{"x":[0,0,0,0,0,0],"y":[-8,-8,-4,2,5,5],"z":[0,0,0,0,-3,-3]},"width":[0,23,23,20,10,0],"height":[0,40,40,35,15,0],"texture":[1,1,63,4],"propeller":false,"vertical":true,"angle":0},"detail4":{"section_segments":[45,135,225,315],"offset":{"x":1,"y":-50,"z":-12},"position":{"x":[0,0,0,0,0,0,0,0,0,20,29,29],"y":[-79,-79,-65,-50,-35,-25,-15,-5,15,42,65,65],"z":[-6,-6,-6,-1,0,0,0,-2,-3.5,2,2,2]},"width":[0,13,31,33,30,26,26,30,32,5,3,0],"height":[0,4,10,22,22,22,25,25,25,15,3,0],"texture":[4],"propeller":false,"vertical":false,"angle":0},"detail5":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,-2,0,0,0],"y":[-60,-60,-20,15,50,50],"z":[0,0,0,0,0,0]},"width":[0,21,26,20,18,0],"height":[0,24,13,12,12,0],"texture":[4,4,4,11.1,4],"propeller":false,"vertical":false,"angle":0},"detail6":{"section_segments":[45,90,135,225,315],"offset":{"x":0,"y":40,"z":-10},"position":{"x":[0,0,0,-2,0,0],"y":[-50,-50,-15,20,60,60],"z":[0,0,0,0,0,0]},"width":[0,18,20,26,21,0],"height":[0,12,12,13,24,0],"texture":[4,11.1,4,4,4],"propeller":false,"vertical":false,"angle":180},"detail7":{"section_segments":6,"offset":{"x":1,"y":-100,"z":9},"position":{"x":[-1,-1,-1,-1,-1,13,14,13,13],"y":[-50,-50,-35,-15,5,20,50,70,70],"z":[-25,-25,-23,-9,-2,0,0,-3,-3]},"width":[0,7,15,20,22,6,3,2,0],"height":[0,2,15,12,8,2,2,2,0],"texture":[9,9,9,9,7,4],"propeller":false,"vertical":false,"angle":0},"detail8":{"section_segments":8,"offset":{"x":40,"y":100,"z":-15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-50,-40,-10,40,50,40,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,12,15,15,15,12,5,0],"height":[0,12,15,15,15,12,5,0],"texture":[4,4,15,4,4,17],"propeller":true,"vertical":false,"angle":0},"detail9":{"section_segments":[45,135,225,315],"offset":{"x":55,"y":-15,"z":-85},"position":{"x":[-7,-7,-3,0,0,-7,-7],"y":[-12,-12,-9,-6,1.5,15,15],"z":[0,0,0,-2,-25,-35,-45]},"width":[0,4,4,4,4,4,0],"height":[0,44,48,49,20,16,0],"texture":[1],"propeller":false,"vertical":true,"angle":0},"detail10":{"section_segments":6,"offset":{"x":49,"y":45,"z":-18},"position":{"x":[-3,-3,0,0,0,0],"y":[-25,-25,-20,20,25,25],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[1,1,63,1],"propeller":false,"vertical":false,"angle":0},"detail11":{"section_segments":[45,135,225,315],"offset":{"x":45,"y":-15,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[0,0,-41,-40,-28,40,40],"z":[0,0,0,0,0,0,0]},"width":[0,2,2,3.5,3.5,3.5,0],"height":[0,2,2,3.5,3.5,3.5,0],"texture":[4,4,4,8,4],"propeller":false,"vertical":false,"angle":0},"detail12":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,-40,-55,-55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":90},"detail13":{"section_segments":6,"offset":{"x":0,"y":95,"z":-50},"position":{"x":[0,0,0,40,55,55],"y":[45,45,55,95,110,110],"z":[24,24,24,0,-8,-8]},"width":[0,35,35,23,18,0],"height":[0,6,6,3,2,0],"texture":[0.2,0.2,0.2,63],"propeller":false,"vertical":false,"angle":-90},"detail14":{"section_segments":[20,60,100,140,180,220,260,300,340,20],"offset":{"x":0,"y":0,"z":-110},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-6,-6,-4,2,5,-2,-2,-2],"z":[0,0,0,0,-3,-3,-3,-3,-3]},"width":[0,40,40,35,20,25,16,0],"height":[0,40,40,35,20,25,16,0],"texture":[0.9,0.9,63,0.9,3.9,16.9,3.9],"propeller":false,"vertical":true,"angle":0},"detail15":{"section_segments":6,"offset":{"x":0,"y":140,"z":-18},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-50,-8,15,30,20,20],"z":[0,0,0,0,0,0,0]},"width":[0,25,25,25,18,8,0],"height":[0,16,15,15,12,5,0],"texture":[3.9,3.9,12.9,3.9,16.9],"propeller":true,"vertical":false,"angle":0},"detail16":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-63,"z":4},"position":{"x":[0,0,0,0,0],"y":[-25,-25,-20,30,30],"z":[0,0,0,0,0]},"width":[0,17,17,17,0],"height":[0,6,6,6,0],"texture":[1,1,10.4444,1],"propeller":false,"vertical":false,"angle":0},"detail17":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":10,"z":3},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-30,-20,30,40,70,70],"z":[0,0,0,-8,-8,-8,-8]},"width":[0,12,17,17,10,10,0],"height":[0,6,6,12,6,6,0],"texture":[3,3,8,63,15,3],"propeller":false,"vertical":false,"angle":0},"detail18":{"section_segments":6,"offset":{"x":58,"y":100,"z":-29},"position":{"x":[0,0,0,0,0,0],"y":[-35,-35,-30,30,35,35],"z":[0,0,0,0,0,0]},"width":[0,5,8,8,5,0],"height":[0,5,8,8,5,0],"texture":[3.9,3.9,11,3.9,3.9],"propeller":false,"vertical":false,"angle":0},"detail19":{"section_segments":[45,135,225,315],"offset":{"x":0,"y":-150,"z":-20},"position":{"x":[0,0,0,0,0,0],"y":[-10,-10,-13,-10,15,15],"z":[0,0,0,0,0,0]},"width":[0,5,7,10,10,0],"height":[0,1,2,4,4,0],"texture":[4,4,1,15],"propeller":false,"vertical":false,"angle":0}},"typespec":{"name":"Space Phantom","level":2,"model":6,"code":206,"specs":{\
"shield":{"capacity":[200,400],"reload":[400,400]},"generator":{"capacity":[300,300],"reload":[19,29]},"ship":{"mass":185,"speed":[290,310],"rotation":[110,110],"acceleration":[115,115],"dash":{"rate":2,"burst_speed":[250,250],"speed":[400,400],"acceleration":[100,100],"initial_energy":[60,60],"energy":[100,100]}}},"shape":[3.262,3.138,2.418,1.682,1.217,1.453,1.455,1.302,1.17,1.083,1.019,0.978,0.956,0.957,0.98,1.017,1.275,1.382,1.584,2.817,3.976,3.77,3.175,3.154,3.414,3.407,3.414,3.154,3.175,3.77,3.976,2.817,1.584,1.382,1.275,1.017,0.98,0.957,0.956,0.978,1.019,1.083,1.17,1.302,1.455,1.453,1.217,1.682,2.418,3.138],"lasers":[],"radius":3.976,"next":[]}}';


// All ships were balanced by comparison with the classic racing, 
// here the balance is used, relevant at the time of the weekend on this track

var ships = [
  Booster_101,
  Astral_Accelerator_102,
  V2_103,
  RAD_Diamond_Lancer_104,
  Vengar_105,
  Space_Phantom_106,

  Booster_201,
  Astral_Accelerator_202,
  V2_203,
  RAD_Diamond_Lancer_204,
  Vengar_205,
  Space_Phantom_206
];


var F1GP = {
  map: ""+
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //10
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //20
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999995555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //4
"9999999999555555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //5
"9999999955555555555555555555555555555555555555555555555555559999999999999999999999999999999999999999\n"+ //6
"99999995555555555555555555555555555555555555555555555555555599999        R   99999999999999999999999\n"+ //7
"9999995555555555555555555555555555555555555555555555555555559999         R     999999999999999999999\n"+ //8
"9999955555555599999999999999999999999999999999999999999999999999         R       9999999999999999999\n"+ //9
"9999955555559999999999999999999999999999999999999999999999999999 RR      R         99999999999999999\n"+    //30
"9999555555599999999999999999999999999999999999999999999999999999     99999999        999999999999999\n"+ //1
"9999555555999999999999999999999999999999999999999999999999999999    99999999999        9999999999999\n"+ //2
"9995555555999999999999999999999999999999999999999999999999999999    9999999999999        99999999999\n"+ //3
"99955555599999999999999999999999999999999999999999999999    9999    999999999999999        999999999\n"+ //4
"9995555559999999999999999999999999999999999999999999999      999UUUU99999999999999999        9999999\n"+ //5
"999555555999999999999999999999999999999999999999999999     D  99    9999999999999999999        99999\n"+ //6
"999555555999999999999999999999999999999999999999999999   99   99    999999999999999999999        999\n"+ //7
"999555555999999999999999999999999999999999999999999999UUU99   99    99999999999999999999999      999\n"+ //8
"999555555999999999999999999999999999999999999999999999   99   99    99999999999999999999999DDDDDD999\n"+ //9
"999555555999999999999999999999999999999999999999999999   99   99    99999999999999999999999      999\n"+    //40
"999555555999999999999999999999999999999999999999999999   99   99    99999999999999999999999      999\n"+ //1
"999555555999999999999999999999999999999999999999999999UUU99 R 99    99999999999999999999999      999\n"+ //2
"999555555999999999999999999999999999999999999999999999   99         99999999999999999999999  DD  999\n"+ //3
"999555555999999999999999999999999999999999999999999999   999       999999999999999999999999 D  D 999\n"+ //4
"999555555999999999999999999999999999999999999999999999   9999     9999999999999999999999999      999\n"+ //5
"99999999999999999999999999999999999999999999999999999 U  9999999999999999999999999999999999      999\n"+ //6
"999999999999999999999999    R   R   R   R   R            9999999999999999999999999999999999      999\n"+ //7
"999999999999999999999                                    9999999999999999999999999999999999      999\n"+ //8
"999      R 999999999                                     9999999999999999999999999999999999  DD  999\n"+ //9
"9        R  99999999  UUU  T                T           99999999999999999999999999999999999 D  D 999\n"+    //50
"9        R   9999999                                  9999999999999999999999999999999999999      999\n"+ //1
"9        R    9999999    999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //2
"9    99999     9999999    99999999999999999999999999999999999999999999999999999999999999999      999\n"+ //3
"9    999999     9999999    9999999999999999999999999999999999999999999999999999999999999999      999\n"+ //4
"9     999999     9999999    999999999999999999999999999999999999999999999999999999999999999      999\n"+ //5
"99     999999     999999    999999999999999999999999999999999999999999999999999999999999999      999\n"+ //6
"99     9999999     99999    999999999999999999999999999999999999999999999999999999999999999      999\n"+ //7
"999UUUUU9999999     9999    999999999999999999999999999999999999999999999999999999999999999      999\n"+ //8
"999     99999999     R      999999999999999999999999999999999999999999999999999999999999999      999\n"+ //9
"9999     99999999    R      999999999999999999999999999999999999999999999999999999999999999  DD  999\n"+    //60
"9999     999999999   R      999999999999999999999999999999999999999999999999999999999999999 D  D 999\n"+ //1
"99999     999999999  R     9999999999999999999999999999999999999999999999999999999999999999      999\n"+ //2
"99999     999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //3
"999999     99999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //4
"999999         L    99999999999999999999999999999999999999999999999999999999999999999999999  DD  999\n"+ //5
"999999         L     9999999999999999999999999999999999999999999999999999999999999999999999 D  D 999\n"+ //6
"999999         L      99999999999999999999999999999999999999999999999999999999999999999999       999\n"+ //7
"9999999        L       9999999999999999999999999999999999999999999999999999999999999999999      9999\n"+ //8
"999999999999999999     9999999999                            9999999999999999999999999999       9999\n"+ //9
"999999999999999999UUUUU99999999              Q                 9999999999999999999999999   D   99999\n"+    //70
"9999999999999999999     999999    99999999999999999999999       9999999999999999999999    D D  99999\n"+ //1
"9999999999999999999                                             L   L   L   L                 999999\n"+ //2
"9999999999999999999        L         B B B B B B B B                                         9999999\n"+ //3
"9999999999999999999         L                                                               99999999\n"+ //4
"99999999999999999999        L      I                          T               T           9999999999\n"+ //5
"999999999999999999999      L          B B B B B B B                                     999999999999\n"+ //6
"99999999999999999999999                                         L   L   L   LLLLL    999999999999999\n"+ //7
"999999999999999999999999999999999999999999999999999999999999999999999999+999999   999999+99999999999\n"+ //8
"99999999999999999999999999999999999999999999999999999999999999999999999999999999   99999999999999999\n"+ //9
"99999999999999999999999999999999999999999999999999999999999999999999999999999999      99999999999999\n"+    //80
"999999999999999999999999999999999999999999999999999999999999999999999999999            9999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //6
"999999999999999999999999999999999999999999999999999999999999999999999999+999999999999999+99999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //90
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",

checkpoints: [
  {x:-145,y:-240,direction:Math.PI,width:150}, // Start / finish line
  {x:0,y:10,direction:0,width:100}, // the 1st third end of track (2nd sector beginning)
  {x:440,y:-45,direction:Math.PI*1.5,width:120} // the 2nd third end of track (3rd sector beginning)
 ],
SpawnX: 310, 
SpawnY: -290
} ;

var IndyGP = {
  map: ""+
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //10
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //20
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999995555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //4
"9999999999555555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //5
"9999999955555555555555555555555555555555555555555555555555559999999999999999999999999999999999999999\n"+ //6
"99999995555555555555555555555555555555555555555555555555555599999        R   99999999999999999999999\n"+ //7
"9999995555555555555555555555555555555555555555555555555555559999         R     999999999999999999999\n"+ //8
"9999955555555599999999999999999999999999999999999999999999999999         R       9999999999999999999\n"+ //9
"9999955555559999999999999999999999999999999999999999999999999999 RR      R         99999999999999999\n"+    //30
"9999555555599999999999999999999999999999999999999999999999999999     99999999        999999999999999\n"+ //1
"9999555555999999999999999999999999999999999999999999999999999999    99999999999        9999999999999\n"+ //2
"9995555555999999999999999999999999999999999999999999999999999999    9999999999999        99999999999\n"+ //3
"9995555559999999999999999999999999999999999999999999999999999999    999999999999999        999999999\n"+ //4
"9995555559999999999999999999999999999999999999999999999999999999UUUU99999999999999999        9999999\n"+ //5
"9995555559999999999999999999999999999999999999999999999999999999    9999999999999999999        99999\n"+ //6
"9995555559999999999999999999999999999999999999999999999999999999    999999999999999999999        999\n"+ //7
"9995555559999999999999999999999999999999999999999999999999999999    99999999999999999999999      999\n"+ //8
"99955555599999999999999999999999999999999999999999999999     R      99999999999999999999999DDDDDD999\n"+ //9
"999555555999999999999999999999999999999999999999999999       R      99999999999999999999999      999\n"+    //40
"999555555999999999999999999999999999999999999999999999       R     999999999999999999999999      999\n"+ //1
"999555555999999999999999999999999999999999999999999999     99999999999999999999999999999999      999\n"+ //2
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999  DD  999\n"+ //3
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999 D  D 999\n"+ //4
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999      999\n"+ //5
"99999999999999999999999999999999999999999999999999999 UU  999999999999999999999999999999999      999\n"+ //6
"999999999999999999999999    R   R   R   R   R             999999999999999999999999999999999      999\n"+ //7
"999999999999999999999                                     999999999999999999999999999999999      999\n"+ //8
"999      R         R                                     9999999999999999999999999999999999  DD  999\n"+ //9
"9        R         R       T                T           9999999999999999999999999999999999  D  D 999\n"+    //50
"9        R         R                                  999999999999999999999999999999             999\n"+
"9        R         R99999999999999999999999999999999999999999999999999999999999999              9999\n"+ //2
"9    9999999999999999999999999999999999999999999999999999999999999999999999999999              99999\n"+ //3
"9    999999999999999999999999999999999999999999999999999999999999999999999999999              999999\n"+ //4
"9     9999999999999999999999999999999999999999999999999999999999999999999999999      999999999999999\n"+ //5
"99     99999999999999999999999999999999999999999999999999999999999999999999999      9999999999999999\n"+ //6
"99     99999999999999999999999999999999999999999999999999999999999999999999999DDDDDD9999999999999999\n"+ //7
"999UUUUU9999999999999999999999999999999999999999999999999999999999999999999999       999999999999999\n"+ //8
"999     99999999999999999999999999999999999999999999999999999999999999999999999       99999999999999\n"+ //9
"9999     999999999999999999999999999999999999999999999999999999999999999999999999       999999999999\n"+    //60
"9999     9999999999999999999999999999999999999999999999999999999999999999999999999       99999999999\n"+ //1
"99999     99999999999999999999999999999999999999999999999999999999999999999999999999      9999999999\n"+ //2
"99999     999999999999999999999999999999999999999999999999999999999999999999999999999       99999999\n"+ //3
"999999     999999999999999999999999999999999999999999999999999999999999999999999999999       9999999\n"+ //4
"999999         L    99999999999999999999999999999999999999999999999999999999999999999999      999999\n"+ //5
"999999         L     99999999999999999999999999999999999999999999999999999999999999999999   D  99999\n"+ //6
"999999         L      99999999999999999999999999999999999999999999999999999999999999999999      9999\n"+ //7
"9999999        L       9999999999999999999999999999999999999999999999999999999999999999999      9999\n"+ //8
"999999999999999999     9999999999                            9999999999999999999999999999       9999\n"+ //9
"999999999999999999UUUUU99999999              Q                 9999999999999999999999999   D   99999\n"+    //70
"9999999999999999999     999999    99999999999999999999999       9999999999999999999999    D D  99999\n"+ //1
"9999999999999999999                                             L   L   L   L                 999999\n"+ //2
"9999999999999999999        L         B B B B B B B B                                         9999999\n"+ //3
"9999999999999999999         L                                                               99999999\n"+ //4
"99999999999999999999        L      I                          T               T           9999999999\n"+ //5
"999999999999999999999      L          B B B B B B B                                     999999999999\n"+ //6
"99999999999999999999999                                         L   L   L   LLLLL    999999999999999\n"+ //7
"999999999999999999999999999999999999999999999999999999999999999999999999+999999   999999+99999999999\n"+ //8
"99999999999999999999999999999999999999999999999999999999999999999999999999999999   99999999999999999\n"+ //9
"99999999999999999999999999999999999999999999999999999999999999999999999999999999      99999999999999\n"+    //80
"999999999999999999999999999999999999999999999999999999999999999999999999999            9999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999               999999999999\n"+ //6
"999999999999999999999999999999999999999999999999999999999999999999999999+999999999999999+99999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //90
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",

checkpoints: [
  {x:-145,y:-240,direction:Math.PI,width:150}, // Start / finish line
  {x:0,y:10,direction:0,width:100}, // the 1st third end of track (2nd sector beginning)
  {x:440,y:40,direction:Math.PI*1.5,width:120} // the 2nd third end of track (3rd sector beginning)
 ],
SpawnX: 310, 
SpawnY: -290
} ;

var MotoGP = {
  map: ""+
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //10
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //20
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999995555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //4
"9999999999555555555555555555555555555555555555555555555555555999999999999999999999999999999999999999\n"+ //5
"9999999955555555555555555555555555555555555555555555555555559999999999999999999999999999999999999999\n"+ //6
"99999995555555555555555555555555555555555555555555555555555599999        L   99999999999999999999999\n"+ //7
"9999995555555555555555555555555555555555555555555555555555559999         L     999999999999999999999\n"+ //8
"9999955555555599999999999999999999999999999999999999999999999999         L       9999999999999999999\n"+ //9
"9999955555559999999999999999999999999999999999999999999999999999 DD      L         99999999999999999\n"+    //30
"9999555555599999999999999999999999999999999999999999999999999999     99999999        999999999999999\n"+ //1
"9999555555999999999999999999999999999999999999999999999999999999    99999999999        9999999999999\n"+ //2
"9995555555999999999999999999999999999999999999999999999999999999    9999999999999        99999999999\n"+ //3
"9995555559999999999999999999999999999999999999999999999999999999    999999999999999        999999999\n"+ //4
"9995555559999999999999999999999999999999999999999999999999999999DDDD99999999999999999        9999999\n"+ //5
"9995555559999999999999999999999999999999999999999999999999999999    9999999999999999999        99999\n"+ //6
"9995555559999999999999999999999999999999999999999999999999999999    999999999999999999999        999\n"+ //7
"9995555559999999999999999999999999999999999999999999999999999999    99999999999999999999999      999\n"+ //8
"99955555599999999999999999999999999999999999999999999999     L      99999999999999999999999UUUUUU999\n"+ //9
"999555555999999999999999999999999999999999999999999999       L      99999999999999999999999      999\n"+    //40
"999555555999999999999999999999999999999999999999999999       L     999999999999999999999999      999\n"+ //1
"999555555999999999999999999999999999999999999999999999     99999999999999999999999999999999      999\n"+ //2
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999  UU  999\n"+ //3
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999 U  U 999\n"+ //4
"999555555999999999999999999999999999999999999999999999    999999999999999999999999999999999      999\n"+ //5
"99999999999999999999999999999999999999999999999999999     999999999999999999999999999999999      999\n"+ //6
"999999999999999999999999    L   L   L   L   L             999999999999999999999999999999999      999\n"+ //7
"999999999999999999999                                     999999999999999999999999999999999      999\n"+ //8
"999      L 999999999                                     9999999999999999999999999999999999  UU  999\n"+ //9
"9        L  99999999  DDD  T                T           99999999999999999999999999999999999 U  U 999\n"+    //50
"9        L   9999999                                  9999999999999999999999999999     9999      999\n"+ //1
"9        L    999999    999999999999999999999999999999999999999999999999999999999        99      999\n"+ //2
"9        L     999999    9999999999999999999999999999999999999999999999999999999         99      999\n"+ //3
"9     99999     999999     9999999999999999999999999999999999999999999999999999        D 99      999\n"+ //4
"9     999999     999999     99999999999999999999999999999999999999999999999999      99   99      999\n"+ //5
"99     999999     999999    99999999999999999999999999999999999999999999999999      99           999\n"+ //6
"99     9999999     99999    99999999999999999999999999999999999999999999999999UUUUUU999    RRR  9999\n"+ //7
"999DDDDD9999999     9999    999999999999999999999999999999999999999999999999999      999       99999\n"+ //8
"999     99999999     L      9999999999999999999999999999999999999999999999999999      99999999999999\n"+ //9
"9999     99999999    L      99999999999999999999999999999999999999999999999999999      9999999999999\n"+    //60
"9999     999999999   L      9999999999999999999999999999999999999999999999999999999   U 999999999999\n"+ //1
"99999     999999999  L     999999999999999999999999999999999999999999999999999999999      9999999999\n"+ //2
"99999     999999999999999999999999999999999999999999999999999999999999999999999999999      999999999\n"+ //3
"999999     999999999999999999999999999999999999999999999999999999999999999999999999999       9999999\n"+ //4
"999999         R    9999999999999999999999999999999999999999999999999999999999999999999      9999999\n"+ //5
"999999         R     9999999999999999999999999999999999999999999999999999999999999999999   U  999999\n"+ //6
"999999         R      9999999999999999999999999999999999999999999999999999999999999999999      99999\n"+ //7
"9999999        R       999999999999999999999999999999999999999999999999999999999999999999      99999\n"+ //8
"999999999999999999     9999999999                            9999999999999999999999999999       9999\n"+ //9
"999999999999999999DDDDD99999999              Q                 9999999999999999999999999   U   99999\n"+    //70
"9999999999999999999     999999    99999999999999999999999       9999999999999999999999    U U  99999\n"+ //1
"9999999999999999999                                             R   R   R   R                 999999\n"+ //2
"9999999999999999999        R            B B B B B B B B                                      9999999\n"+ //3
"9999999999999999999         R                                                               99999999\n"+ //4
"99999999999999999999        R                           I     T               T           9999999999\n"+ //5
"999999999999999999999      R             B B B B B B B                                  999999999999\n"+ //6
"99999999999999999999999    RRRRR                                 R   R   R   R       999999999999999\n"+ //7
"99999999999999999+9999999   99999+999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"999999999999999999999999   9999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"999999999999999999999      9999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //80
"99999999999999999999           999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"99999999999999999+999999999999999+999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //90
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",
checkpoints: [
  {x:60,y:-240,direction:0,width:150}, // Start / finish line
  {x:440,y:40,direction:Math.PI*0.5,width:100}, // the 1st third end of track (2nd sector beginning)
  {x:0,y:10,direction:Math.PI,width:120} // the 2nd third end of track (3rd sector beginning)
 ],
SpawnX: -240, 
SpawnY: -290
} ;

var NascarGP = {
  map: ""+
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //10
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //20
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"999999999999999                                                                      999999999999999\n"+ //4
"999999999999                       L                 L                                  999999999999\n"+ //5
"9999999999                        L                 L                                     9999999999\n"+ //6
"99999999                          L                 L       T                 T             99999999\n"+ //7
"9999999                            L                 L                                       9999999\n"+ //8
"999999                                                       L   L   L   L   L                999999\n"+ //9
"99999         999999999999999999999999999999999999999999999999999999999999999999999999         99999\n"+    //30
"99999  D D  9999999999999999999999999999999999999999999999999999999999999999999999999999    U  99999\n"+ //1
"9999    D  999999999999999999999999999999999999999999999999999999999999999999999999999999  U U  9999\n"+ //2
"9999      99999999999999999999999999999999999999999999999999999999999999999999999999999999      9999\n"+ //3
"999       99999999999999999999999999999999999999999999999999999999999999999999999999999999       999\n"+ //4
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //5
"999 D  D 9999999999999999999999999999999999999999999999999999999999999999999999999999999999  UU  999\n"+ //6
"999  DD  9999999999999999999999999999999999999999999999999999999999999999999999999999999999 U  U 999\n"+ //7
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //8
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //9
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+    //40
"999 D  D 9999999999999999999999999999999999999999999999999999999999999999999999999999999999  UU  999\n"+ //1
"999  DD  9999999999999999999999999999999999999999999999999999999999999999999999999999999999 U  U 999\n"+ //2
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //3
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //4
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //5
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //6
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //7
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //8
"999 D  D 9999999999999999999999999999999999999999999999999999999999999999999999999999999999  UU  999\n"+ //9
"999  DD  9999999999999999999999999999999999999999999999999999999999999999999999999999999999 U  U 999\n"+    //50
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //1
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //2
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //3
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //4
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //5
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //6
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //7
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //8
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //9
"999 D  D 9999999999999999999999999999999999999999999999999999999999999999999999999999999999  UU  999\n"+    //60
"999  DD  9999999999999999999999999999999999999999999999999999999999999999999999999999999999 U  U 999\n"+ //1
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //2
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //3
"999      9999999999999999999999999999999999999999999999999999999999999999999999999999999999      999\n"+ //4
"999 D  D 9999999999999999999999999999999999999999999999999999999999999999999999999999999999  UU  999\n"+ //5
"999  DD  9999999999999999999999999999999999999999999999999999999999999999999999999999999999 U  U 999\n"+ //6
"999       99999999999999999999999999999999999999999999999999999999999999999999999999999999       999\n"+ //7
"9999      99999999999999999999999999999999999999999999999999999999999999999999999999999999      9999\n"+ //8
"9999       9999999999999999999999                            9999999999999999999999999999       9999\n"+ //9
"99999  D D  99999999999999999999             Q                 9999999999999999999999999   U   99999\n"+    //70
"99999   D     9999999999999999       99999999999999999999999    9999999999999999999999    U U  99999\n"+ //1
"999999                                                          R   R   R   R                 999999\n"+ //2
"9999999                    R            B B B B B B B B                                      9999999\n"+ //3
"99999999                    R                                                               99999999\n"+ //4
"9999999999                  R                           I     T               T           9999999999\n"+ //5
"999999999999               R             B B B B B B B                                  999999999999\n"+ //6
"999999999999999            RRRRR                                 R   R   R   R       999999999999999\n"+ //7
"99999999999999999+9999999   99999+999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"999999999999999999999999   9999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"999999999999999999999      9999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //80
"99999999999999999999           999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"999999999999999999               9999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"99999999999999999+999999999999999+999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+    //90
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //1
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //2
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //3
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //4
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //5
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //6
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //7
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //8
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n"+ //9
"9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",

checkpoints: [
  {x:60,y:-240,direction:0,width:150}, // Start / finish line
  {x:330,y:240,direction:Math.PI,width:100}, // the 1st third end of track (2nd sector beginning)
  {x:-320,y:235,direction:Math.PI,width:120} // the 2nd third end of track (3rd sector beginning)
 ],
SpawnX: -240, 
SpawnY: -290,
} ;




var tracks = [F1GP,IndyGP,MotoGP,NascarGP] ;
var current_track = 0;

var game, map, checkpoints, map_lines, allow_ship_switch;
var point_system = [10,8,6,4,3,2,1];

race_close_time *= 60;
ship_switch_delay *= 60;


var setTrack = function(game,trackid) {
  var track = tracks[trackid];
  checkpoints = track.checkpoints;
  map = outlap.init_lap_map(track.map);
  game.setCustomMap(map);
  map_lines = map.split("\n");
  SpawnX = tracks[trackid].SpawnX;
  SpawnY = tracks[trackid].SpawnY;
  game.removeObject();
  addObjects(game);
}


var scoreboard = {
  id:"scoreboard",
  visible: true,
  components: [
    { type:"box",position:[0,0,100,100],fill:"#456",stroke:"#CDE",width:2},
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "My Text"}
  ]
} ;

var lap_info = {
  id:"lap_info",
  visible: true,
  position: [30,90,40,5],
  components: [
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "Race for fastest lap"}
  ]
} ;

var race_info = {
  id:"race_info",
  visible: true,
  position: [30,5,40,5],
  components: [
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "Qualification"}
  ]
};

var countdown = {
  id:"race_info",
  visible: true,
  position: [40,5,20,10],
  components: [
    { type: "text",position: [0,0,100,100],color: "#FFF",value: "5"}
  ]
};


// Track background, can be used on map pattern with shortcut:
var PitLane = {
  id: "PitLane",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/pitlaneNEW.png"
} ;

var DRSMirror = {
  id: "DRSMirror",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"

};

var DRSHoriz = {
  id: "DRSHooriz",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"

};

var DRSZone = {
  id: "DRSZone",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/drsPS.png"

} ;

var startline = {
  id: "startline",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/startline.png"
} ;

var startblock = {
  id: "startblock",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/startblock.png"
} ;


var arrow = {
  id: "arrow",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  emissive: "https://starblast.data.neuronality.com/mods/objects/arrow.png"
} ;


var ShipsGallery = {
  id: "ShipsGallery",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/racingships2.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/racingships2.png"
} ;

var AboutMod = {
  id: "AboutMod",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/aboutmod2.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/aboutmod2.png"
} ;

var TrackInfo = {
  id: "TrackInfo",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/abouttrackUSA.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/abouttrackUSA.png"
} ;

var SRCLogo = {
  id: "SRCLogo",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/RacingLOGO.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/RacingLOGO.png"
} ;

var addSRCLogo = function(x,y) {
  game.setObject({
    id: "SRCLogo"+x+y,
    type: SRCLogo,
    position: {x:x,y:y,z:-2.5},
    scale: {x:25,y:25,z:36},
    rotation: {x:600,y:0,z:0}
  }) ;
};

var SpawnAndSwitch = {
  id: "SpawnAndSwitch",
  obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
  diffuse: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/spawnandswitch.png",
  emissive: "https://raw.githubusercontent.com/mrGoldmanus/RACING-/master/spawnandswitch.png"
} ;


var addSwitch = function() {
  if (current_track != 3) {
    game.setObject({
      id: "SpawnAndSwitch", 
      type: SpawnAndSwitch,
      position: {x:SpawnX,y:SpawnY,z:-2.5},
      scale: {x:20,y:20,z:36},
      rotation: {x:600,y:0,z:0}
    });
  }
}



var change_button = {
  id: "change",
  position: [6,30,8,14],
  clickable: true,
  shortcut: "E",
  visible: true,
  components: [
    { type: "box",position:[0,0,100,100],stroke:"#CDE",width:2},
    { type: "text",position:[10,35,80,30],value:"Switch",color:"#CDE"},
    { type: "text",position:[20,70,60,20],value:"[E]",color:"#CDE"}
  ],
};

var change_button_hidden = {
  id: "change",
  position: [0,0,0,0],
  clickable: false,
  visible: false,
  components: [],
};


var show_spawn_objects = function(game) {
  if (current_track != 3) {
    game.setObject({
      id: "SpawnAndSwitch", 
      type: SpawnAndSwitch,
      position: {x:SpawnX,y:SpawnY,z:-2.5},
      scale: {x:20,y:20,z:36},
      rotation: {x:600,y:0,z:0}
    });
  }

  game.setObject({
    id: "ShipsGallery",
    type: ShipsGallery,
    position: {x:SpawnX+45,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });

  game.setObject({
    id: "AboutMod",
    type: AboutMod,
    position: {x:SpawnX-5,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });

  game.setObject({
    id: "TrackInfo",
    type: TrackInfo,
    position: {x:SpawnX-55,y:SpawnY-45,z:-2.5},
    scale: {x:49,y:49,z:36},
    rotation: {x:600,y:0,z:0}
  });
}

var hide_spawn_objects = function(game) {
  if (current_track != 3) {
    game.removeObject("SpawnAndSwitch");
  }
  game.removeObject("ShipsGallery");
  game.removeObject("AboutMod");
  game.removeObject("TrackInfo");
}


var addObjects = function(game) {
  show_spawn_objects(game);

  // comment out first logo - it's badly rendering sometimes
  // TODO: check it later
  // var step = 50;
  // addSRCLogo(
    // checkpoints[0].x + step * Math.cos(checkpoints[0].direction),
    // checkpoints[0].y + step * Math.sin(checkpoints[0].direction)
  // );
  for (var i = 1; i < checkpoints.length; i++) {
    addSRCLogo(checkpoints[i].x, checkpoints[i].y);
  }

  for (var y=0;y<map_lines.length;y++)
  {
    var line = map_lines[y];

    for (var x=0;x<line.length;x++)
    {
      var px =  (x+.5-map_size/2)*10 ;
      var py =  (map_size-y-1+.5-map_size/2)*10 ;

      switch (line.charAt(x))
      {
        case "R":
          game.setObject({id: "R"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI/2}
          });
          break ;
        case "U":
         game.setObject({id: "U"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI}
          });
          break ;
        case "L":
         game.setObject({id: "L"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI*1.5}
          });
          break ;
        case "D":
          game.setObject({id: "D"+px+":"+py,
            type:arrow,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:0}
          });
          break ;
        case "I":
          game.setObject({id: "I"+px+":"+py,
            type:startline,
            position: {x:px,y:py+5,z:-2},
            scale: {x:40,y:40,z:40},
            rotation: {x:0,y:0,z:Math.PI*0.5}
          });
          break ;
        case "B":
          game.setObject({id: "B"+px+":"+py,
            type:startblock,
            position: {x:px,y:py,z:-2},
            scale: {x:6,y:6,z:6},
            rotation: {x:0,y:0,z:Math.PI/2 + checkpoints[0].direction}
          });
          break ;
        case "T":
          game.setObject({id: "T"+px+":"+py,
            type: DRSZone,
            position: {x:px,y:py+5,z:-2},
            scale: {x:29,y:23,z:26},
            rotation: {x:Math.PI,y:0,z:Math.PI*.5}
          });
          break ;
        case "H":
          game.setObject({id: "H"+px+":"+py,
            type: DRSHoriz,
            position: {x:px,y:py,z:-2},
            scale: {x:33,y:25,z:26},
            rotation: {x:600,y:0,z:0}
          });
          break ;
        case "M":
          game.setObject({id: "M"+px+":"+py,
            type: DRSMirror,
            position: {x:px,y:py+5,z:-2}, //PY+5!!!
            scale: {x:29,y:23,z:26},
            rotation: {x:Math.PI,y:0,z:Math.PI*.5}
          });
          break ;
        case "Q":
          game.setObject({id: "Q"+px+":"+py,
            type: PitLane,
            position: {x:px,y:py+5,z:-2}, //PY+3!!!!
            scale: {x:32,y:22,z:26},
            rotation: {x:600,y:0,z:Math.PI*2}
          });
          break ;
      }
    }
  }
} ;


// Not in use:
var popCollectible = function(game) {

  var choice = [10,11,10,11,20,21,90,90,90,90,90,90,90];
  var code = choice[Math.floor(Math.random()*choice.length)];

  var x = Math.floor(Math.random()*game.options.map_size);
  var y = Math.floor(Math.random()*game.options.map_size);
  if (map_lines[y].substring(x,x+1)==" ")
  {
    x = (x+.5-game.options.map_size/2)*10 ;
    y = (game.options.map_size-y-1+.5-game.options.map_size/2)*10 ;

  }
} ; 
/////////
var formatLapTime = function(time) {
  if (time>10000)
  {
    return "-" ;
  }
 time = Math.round(time*1000) ;
 var cents = time%1000 ;
 var seconds = Math.floor(time/1000)%60;
 var minutes = Math.floor(time/60000) ;
 if (cents<10) cents = "0"+cents;
 if (cents<100) cents = "0"+cents;
 if (seconds<10) seconds = "0"+seconds;
 return minutes+":"+seconds+":"+cents ;
}

var formatMinutesSeconds = function(time) {
 var seconds = time%60;
 var minutes = Math.floor(time/60) ;
 if (seconds<10) seconds = "0"+seconds;
 return minutes+":"+seconds ;
}

// TODO: Commented out for public events
// Disable debug output (tick time & data sent)

// game.modding.tick = function(t) {
  // this.game.tick(t);
  // if (this.context.tick != null) {
    // this.context.tick(this.game);
  // }
// };

// TODO: Disabled for public events
// Color terminal output

var color_message = function(message, color, style) {
  return;
  if (!color) {
    color = "";
  }
  if (!style) {
    style = "";
  }
  return `[[${style};${color};]${message}]`;
}

var color_echo = function(message, color, style) {
  return;
  echo(color_message(message, color, style));
}

var color_name = function(index, name, color) {
  return;
  return color_message(index, color, "b") + color_message(" | ", color) + color_message(name, color, "b");
}

var color_echo_with_name = function(message, index, name, color) {
  return;
  echo(color_message(message + " ", color) + color_name(index, name, color));
}

// Tools

// TODO: Disabled for public events
var fatal_error = function(message) {
  return;
  var modding = game.modding;
  if (!modding.field_view) {
    modding.context.stop = true;
    var terminal = modding.terminal;
    if (!terminal.error.old) {
      var error = function() {
        error.old.apply(this, arguments);
        if (modding.context && modding.context.stop) {
          modding.context = null;
          throw "Mod stopped";
        }
      };
      error.old = terminal.error;
      terminal.error = error;
    }
  }
  throw "\nFatal Error: " + message + "\n";
}

// TODO: Disabled for public events
var error = function(message) {
  return;
  game.modding.terminal.error("Error: " + message);
}

// Instructor tools

var hide_race_info = function(ship) {
  if (race_info.forced) {
    return;
  }
  var visible = race_info.visible;
  race_info.visible = false;
  if (ship == null) {
    for (var ship of game.ships) {
      if (!ship.custom.hide_race_info) {
        ship.custom.hide_race_info = true;
        ship.setUIComponent(race_info);
      }
    }
  } else if (!ship.custom.hide_race_info) {
    ship.custom.hide_race_info = true;
    ship.setUIComponent(race_info);
  }
  race_info.visible = visible;
}

var show_race_info = function(ship) {
  if (ship == null) {
    for (var ship of game.ships) {
      if (ship.custom.hide_race_info) {
        ship.custom.hide_race_info = false;
        ship.setUIComponent(race_info);
      }
    }
  } else if (ship.custom.hide_race_info) {
    ship.custom.hide_race_info = false;
    ship.setUIComponent(race_info);
  }
}

var update_race_info = function(ship, forced) {
  race_info.forced = !!forced;
  if (ship == null) {
    for (var ship of game.ships) {
      if (forced || !ship.custom.hide_race_info) {
        ship.setUIComponent(race_info);
      }
    }
  } else if (forced || !ship.custom.hide_race_info) {
    ship.setUIComponent(race_info);
  }
}

var instructor_cleaner = function(message) {
  var newlines = 5;
  var i;
  for (i = 0; i < newlines && i < message.length; i++) {
    if (message[message.length - i - 1] != "\n") {
      break;
    }
  }
  return "\n".repeat(newlines - i);
}

// Global commands
// TODO: un-globalized for public events

var instructor = function(message, time = 15, character = "Lucina", cancel_old_action = false, timeout_action = null) {
  clearTimeout(game.custom.instructor_timer);
  for (var ship of game.ships) {
    clearTimeout(ship.custom.instructor_timer);
    ship.custom.instructor_timer = 0;
    ship.instructorSays(message, character);
  }
  hide_race_info();
  var cleaner = instructor_cleaner(message);
  game.custom.instructor_timer = setTimeout(function() {
    for (var ship of game.ships) {
      if (!ship.custom.instructor_timer) {
        if (cleaner.length) {
          ship.instructorSays(cleaner, character);
        }
        ship.hideInstructor();
        show_race_info(ship);
      }
    }
  }, time * 1000);
  if (cancel_old_action) {
    clearTimeout(game.custom.instructor_action_timer);
  }
  if (typeof timeout_action === "function") {
    game.custom.instructor_action_timer = setTimeout(timeout_action, time * 1000);
  }
};

var announce_lap_record = function(lap_time, player) {
  instructor(`\nNew lap record!\n\n${lap_time} - ${player}\n\n`, 7, "Kan");
}

var ship_instructor = function(ship, message, time = 15, character = "Lucina") {
  if (typeof ship === "number") {
    var ship_number = ship;
    ship = game.ships[ship-1];
    if (ship == null) {
      error("Ship " + ship_number + " not found");
      return;
    }
  } else if (ship == null) {
    error("Ship not found");
    return;
  }
  clearTimeout(ship.custom.instructor_timer);
  ship.instructorSays(message, character);
  hide_race_info(ship);
  var cleaner = instructor_cleaner(message);
  ship.custom.instructor_timer = setTimeout(function() {
    if (cleaner.length) {
      ship.instructorSays(cleaner, character);
    }
    ship.hideInstructor();
    show_race_info(ship);
  }, time * 1000);
};

var warnings = [
  "\nWarning! (rule 1)\nYou're breaking asteroids!\nIf you continue, you will be immobilized\n",
  "\nWarning! (rule 2)\nYou prevent the rest of the players from completing the lap!\nIf you continue, you will be warped to spawn, then kicked",
  "\nWarning! (rule 3)\nDangerous driving!\nIf you continue, you will be warped to spawn, then kicked\n",
  "\nWarning! (rule 4)\nYou are using mines on pitlane/start!\nContinue - instant kick!\n",
  "\nWarning! (rule 5)\nTrolling detected!\nContinue - instant kick!\n\n",
  "\nStop trolling or messing around on lap! Either stay in spawn-zone, or drive race laps.\nNext time will be kicked!\n",
];

var warn = function(ship_number, rule, time = 25, character = "Zoltar") {
  if (rule < 1 || rule > 6) {
    error("Unknown rule number (should be 1 to 6)");
    return;
  }
  rule--;
  ship_instructor(ship_number, warnings[rule], time, character);
};

var flags = {
  Y: {
    message: "\n\nCaution! Yellow flag!\nBe careful. Aggressive overtaking will be considered as dangerous driving!\n",
    time: 25,
    character: "Maria",
  },
  R: {
    message: "\n\nRed flag!\nThe race is prematurely completed without results. It can be stopped because of a large-scale bug or total trolling!   :(",
    time: 40,
    character: "Zoltar",
  },
  G: {
    message: "\n\n\nGreen flag!\nThe race continues\n\n",
    time: 15,
    character: "Klaus",
  },
  VSC: {
    message: "\n\n\nVirtual safety car!\nAll ships is immobilized\n(for 10-30 sec)\nI need to kick a troll or there was an incident which I need to fix.",
    time: 30,
    character: "Maria",
    idle: true,
  },
};

var flag = function(flag) {
  var found = false;
  var lc_flag = String(flag).toLowerCase();
  for (var key of Object.keys(flags)) {
    if (key.toLowerCase() === lc_flag) {
      found = true;
      break;
    }
  }
  if (!found) {
    error("Unknown flag: " + flag);
    return;
  }

  var idle_ships = function() {
    for (var ship of game.ships) {
      ship.set({idle:true,vx:0,vy:0});
    }
    afk_check.disable(true);
  }
  var reset_ships = function() {
    for (var ship of game.ships) {
      ship.set({idle:false});
    }
    afk_check.enable(true);
  }

  var timeout_action = null;
  if (flags[key].idle) {
    idle_ships();
    timeout_action = reset_ships;
  } else {
    reset_ships();
  }
  instructor(flags[key].message, flags[key].time, flags[key].character, true, timeout_action);
};

var kick_position = 10 * map_size / 2;
kick_position = {x: -kick_position, y: kick_position};

var kick = function(ship, message_object) {
  if (typeof ship === "number") {
    var ship_number = ship;
    ship = game.ships[ship-1];
    if (ship == null) {
      error("Ship " + ship_number + " not found");
      return;
    }
  } else if (ship == null) {
    error("Ship not found");
    return;
  }
  var space = function(num) {
    return " \u2063".repeat(num);
  }
  outlap.clear_outlap(ship);
  clearTimeout(ship.custom.instructor_timer);
  // TODO: fix kill - set infinite shield regen for all ships, make ships vulnerable
  ship.set({x: kick_position.x, y: kick_position.y, kill: true});
  if (typeof message_object === "object" && message_object !== null) {
    ship.gameover({message_object});
  } else {
    ship.gameover({"":"Kick!" + space(46), " ":"You were kicked because violated game rules" + space(7)});
  }
};

// Add global functions to terminal commands
// Allowed params: strings, numbers, null / false / true

var commands = [
  "instructor",
  "flag",
  "warn",
  "kick",
];

var command_function = function(line) {
  line = line.trim();
  var match_command = line.match(/^(\S+)\s*/);
  if (!match_command) {
    error(`Can't extract command name from call string:\n"${line}"`);
    return;
  }
  var command = match_command[1];
  if (!commands.includes(command)) {
    error(`Unknown command: "${command}"`);
    return;
  }
  if (typeof window[command] !== "function") {
    error(`Command global function doesn't exist: "${command}"`);
    return;
  }

  line = line.substring(match_command[0].length);
  if (!line.length) {
    window[command].apply(this);
    return;
  }

  var pre_args = line.split(/(?<=[^\\]")[, ] *|[, ] *(?=")/);
  var args = [];
  for (var str of pre_args) {
    if (str.includes('"')) {
      args.push(str.replace(/"/g, ""));
    } else {
      for (var val of str.split(/[, ] */)) {
        if (val.length) {
          if (val === "null") {
            val = null;
          } else if (val === "false") {
            val = false;
          } else if (val === "true") {
            val = true;
          } else {
            var num = Number(val);
            if (!isNaN(num) && !isNaN(parseFloat(val))) {
              val = num;
            }
          }
        }
        args.push(val);
      }
    }
  }
  window[command].apply(this, args);
}

// TODO: Disabled for public events
// for (var command of commands) {
  // game.modding.commands[command] = command_function;
// }

// AFK check

var afk_check = {
  state: true,
  disable: function(with_idle = false) {
    this.state = false;
    for (var ship of game.ships) {
      ship.custom.afk_init_step = 0;
      ship.custom.afk_seconds = 0;
      ship.custom.afk = false;
    }
    var message = "AFK check disabled";
    if (with_idle) {
      message = "Ships are idle\n" + message;
    }
    color_echo(message, "Gold");
  },
  enable: function(with_idle = false) {
    this.state = true;
    var message = "AFK check enabled";
    if (with_idle) {
      message = "Ships are no longer idle\n" + message;
    }
    color_echo(message, "Lime");
  },
  check: function(ship, index) {
    if (this.state && !ship.custom.on_spawn_zone) {
      if (ship.alive && Math.sqrt(Math.pow(ship.vx, 2) + Math.pow(ship.vy, 2)) < afk_speed) {
        if (!ship.custom.afk) {
          if (!ship.custom.afk_init_step) {
            ship.custom.afk_init_step = game.step;
          } else {
            ship.custom.afk_seconds = (game.step - ship.custom.afk_init_step) / 60;
            if (ship.custom.afk_seconds >= afk_timeout) {
              ship.custom.afk = true;
              color_echo_with_name("AFK:", index + 1, ship.name, "DarkOrange");
              afk_action(ship);
            }
          }
        }
      } else {
        ship.custom.afk_init_step = 0;
        ship.custom.afk_seconds = 0;
        if (ship.custom.afk) {
          ship.custom.afk = false;
          color_echo_with_name("No longer AFK:", index + 1, ship.name, "LimeGreen");
        }
      }
    }
  },
};

// Out lap detection

var outlap = {
  lap_map: null,
  spawn_zone: null,
  spawn_zone_map: null,
  lap_map_size: map_size * lap_map_precision,
  outlap_delay: outlap_delay * 1000,
  onlap_blink_time: onlap_blink_time * 60,
  pos_offset: 10 * map_size / 2,
  pos_div: 10 / lap_map_precision,
  init_lap_map: function(map) {
    var new_map = [];
    var map_lines = map.split("\n");
    if (map_lines.length !== map_size) {
      fatal_error("Mismatched map_size and number of custom_map lines");
    }
    this.lap_map = {};
    this.spawn_zone = [];
    this.spawn_zone_map = {};
    var map_y = 0;
    for (var line of map_lines) {
      if (line.length !== map_size) {
        fatal_error("Mismatched map_size and length of custom_map line " + (map_y + 1));
      }
      var spawn_zone_found = false;
      var safe_y_start = map_y * lap_map_precision;
      var safe_y_end = safe_y_start + lap_map_precision;
      var lap_y_start = safe_y_start - lap_map_overlap;
      var lap_y_end = safe_y_end + lap_map_overlap;
      var map_x = 0;
      for (var symbol of line) {
        if (symbol === "+") {
          spawn_zone_found = true;
          this.spawn_zone.push({x: map_x, y: map_y});
        } else if (!/\d/.test(symbol)) {
          var safe_x_start = map_x * lap_map_precision;
          var safe_x_end = safe_x_start + lap_map_precision;
          var lap_x_start = safe_x_start - lap_map_overlap;
          var lap_x_end = safe_x_end + lap_map_overlap;
          for (var y = safe_y_start; y < safe_y_end; y++) {
            if (!this.lap_map[y]) {
              this.lap_map[y] = {};
            }
            for (var x = safe_x_start; x < safe_x_end; x++) {
              this.lap_map[y][x] = 2; // safe zone
            }
          }
          for (var lap_y = lap_y_start; lap_y < lap_y_end; lap_y++) {
            var y = lap_y % this.lap_map_size;
            if (y < 0) {
              y += this.lap_map_size;
            }
            if (!this.lap_map[y]) {
              this.lap_map[y] = {};
            }
            for (var lap_x = lap_x_start; lap_x < lap_x_end; lap_x++) {
              var x = lap_x % this.lap_map_size;
              if (x < 0) {
                x += this.lap_map_size;
              }
              if (!this.lap_map[y][x]) {
                this.lap_map[y][x] = 1; // on lap
              }
            }
          }
        }
        map_x++;
      }
      if (spawn_zone_found) {
        line = line.replace(/\+/g, "9");
      }
      new_map.push(line);
      map_y++;
    }
    var empty_y = {};
    for (var y = 0; y < this.lap_map_size; y++) {
      if (!this.lap_map[y]) {
        this.lap_map[y] = empty_y;
      }
    }
    // TODO: add error handling for spawn_zone square
    var spawn_index = [];
    var spawn_start = this.spawn_zone[0];
    var spawn_end = this.spawn_zone[this.spawn_zone.length-1];
    spawn_start.x = (spawn_start.x + 1) * lap_map_precision - lap_map_overlap;
    spawn_start.y = (spawn_start.y + 1) * lap_map_precision - lap_map_overlap;
    spawn_end.x = spawn_end.x * lap_map_precision + lap_map_overlap;
    spawn_end.y = spawn_end.y * lap_map_precision + lap_map_overlap;
    for (var y = spawn_start.y; y < spawn_end.y; y++) {
      for (var x = spawn_start.x; x < spawn_end.x; x++) {
        var status = this.lap_map[y][x];
        if (status) {
          if (!this.spawn_zone_map[y]) {
            this.spawn_zone_map[y] = {};
          }
          this.spawn_zone_map[y][x] = true;
          if (status === 2) {
            spawn_index.push({x, y});
          }
        }
      }
    }
    for (var y = 0; y < this.lap_map_size; y++) {
      if (!this.spawn_zone_map[y]) {
        this.spawn_zone_map[y] = empty_y;
      }
    }
    this.spawn_zone = spawn_index;
    map = new_map.join("\n");
    return map;
  },
  lap_map_pos: function(ship) {
    var x = Math.trunc((this.pos_offset + ship.x) / this.pos_div) % this.lap_map_size;
    var y = Math.trunc((this.pos_offset - ship.y) / this.pos_div) % this.lap_map_size;
    if (x < 0) {
      x += this.lap_map_size;
    }
    if (y < 0) {
      y += this.lap_map_size;
    }
    return {x, y};
  },
  game_pos: function(position) {
    var x = (position.x + 0.5) * this.pos_div - this.pos_offset;
    var y = this.pos_offset - (position.y + 0.5) * this.pos_div;
    return {x, y};
  },
  bind_outlap: function(outlap, ship) {
    return function() {
      ship.custom.outlap_timer = 0;
      var position = outlap.lap_map_pos(ship);
      if (!outlap.lap_map[position.y][position.x]) {
        ship.set({
          x: ship.custom.safe_x,
          y: ship.custom.safe_y,
          vx: 0,
          vy: 0,
          invulnerable: outlap.onlap_blink_time,
          healing: false,
        });
      }
    }
  },
  clear_outlap: function(ship) {
    if (ship.custom.outlap_timer) {
      clearTimeout(ship.custom.outlap_timer);
      ship.custom.outlap_timer = 0;
      ship.set({healing: false});
    } else if (ship.healing) {
      ship.set({healing: false});
    }
  },
  check: function(ship) {
    if (ship.alive) {
      var position = this.lap_map_pos(ship);
      var status = this.lap_map[position.y][position.x];
      // safe zone
      if (status === 2) {
        ship.custom.safe_x = ship.x;
        ship.custom.safe_y = ship.y;
        ship.custom.safe_lap_map_pos = position;
        this.clear_outlap(ship);
        this.check_spawn_zone(ship, position);
      // on lap
      } else if (status) {
        this.clear_outlap(ship);
        this.check_spawn_zone(ship, position);
      // out lap
      } else if (!ship.custom.outlap_timer && !ship.healing) {
        ship.custom.outlap_timer = setTimeout(this.bind_outlap(this, ship), this.outlap_delay);
        ship.set({vx: 0, vy: 0, healing: true});
        if (ship.custom.allow_switch) {
          ship.custom.allow_switch = false;
          ship.setUIComponent(change_button_hidden);
        }
      }
    }
  },
  check_spawn_zone: function(ship, position) {
    var status = this.spawn_zone_map[position.y][position.x];
    ship.custom.on_spawn_zone = status;

    // ship is in spawn-zone
    if (status) {
      ship.custom.afk_init_step = 0;
      ship.custom.afk_seconds = 0;
      ship.custom.afk = false;
      ship.custom.troll_step = 0;
      ship.custom.troll = false;
    }

    if (allow_ship_switch && status) {
      if (!ship.custom.allow_switch) {
        ship.custom.allow_switch = true;
        ship.setUIComponent(change_button);
      }
    } else if (ship.custom.allow_switch) {
      ship.custom.allow_switch = false;
      ship.setUIComponent(change_button_hidden);
    }
  },
}

var checkShip = function(ship, index) {
  if (!ship.custom.init && ship.alive) {
    ship.custom.init = true;
    if (game.custom.closed) {
      spawnShip(ship, true);
      setTimeout(function() {
        ship_instructor(ship, "\n\nRace is already running,\nplease wait for next race\n\n", 20, "Maria");
      }, 1000 * 10);
    } else {
      spawnShip(ship);
    }
    ship_instructor(ship, welcome_message[map_name_type], 20, "Lucina");
  }

  afk_check.check(ship, index);

  outlap.check(ship);

  if (ship.custom.current_checkpoint == null)
  {
    ship.custom.current_checkpoint = 0 ;
    ship.custom.checkpoint_count = 0 ;
    ship.custom.lap_count = 0 ;
    ship.custom.checkpoint_time = 0 ;
    ship.custom.best_lap = 100000 ;
    if (ship.game.custom.status == "qualification")
    {
      race_info.components[0].value = "";
      race_info.visible = true ;
      update_race_info();
    }
  }

  if (checkCheckPoint(ship,checkpoints[ship.custom.current_checkpoint]))
  {
    if (ship.game.custom.status != "qualification" && ship.custom.lap_count>race_laps)
    {
    }
    else
    {
      if (checkpoint_times[ship.custom.checkpoint_count] == null)
      {
        checkpoint_times[ship.custom.checkpoint_count] = ship.game.step/60 ;
        ship.custom.checkpoint_delta = 0 ;
      }
      else
      {
        ship.custom.checkpoint_delta = Math.round(ship.game.step/60-checkpoint_times[ship.custom.checkpoint_count]) ;
      }
      ship.custom.checkpoint_count++ ;
      ship.custom.checkpoint_time = ship.game.step/60/3600 ;
    }
    if (ship.custom.current_checkpoint == 0)
    {
      ship.custom.lap_count++ ;
      if (!game.custom.enable_drs && ship.custom.lap_count == enable_drs_on_race_lap) {
        game.custom.enable_drs = true;
        game.custom.drs_step = game.step % drs_step;
      }
      if (ship.custom.lap_start != null)
      {
        var time = (game.step-ship.custom.lap_start-1+extra_bit)/60 ;
        if (ship.custom.best_lap == null || time<ship.custom.best_lap)
        {
          ship.custom.best_lap = time;
          if (ship.custom.lap_count <= race_laps)
          {
            var time_formatted = formatLapTime(time);
            lap_info.components[0].value = "Best lap! "+ time_formatted;
            ship.setUIComponent(lap_info);
            if (game.custom.lap_record == null || game.custom.lap_record > time) {
              game.custom.lap_record = time;
              announce_lap_record(time_formatted, ship.name);
            }
          }
        }
        else
        {
          if (ship.custom.lap_count <= race_laps)
          {
            lap_info.components[0].value = "Lap time: "+ formatLapTime(time) ;
            ship.setUIComponent(lap_info);
          }
        }
      }
      ship.custom.lap_start = game.step-1+extra_bit ;
    }
    ship.custom.current_checkpoint = (ship.custom.current_checkpoint+1)%checkpoints.length;
    ship.custom.troll_step = 0;
    if (ship.custom.troll) {
      ship.custom.troll = false;
      color_echo_with_name("No longer troll:", index + 1, ship.name, "LimeGreen");
    }
  } else {
    if (!ship.custom.afk) {
      if (!ship.custom.troll && !ship.custom.on_spawn_zone) {
        if (!ship.custom.troll_step) {
          ship.custom.troll_step = troll_timeout * 60 + game.step;
        } else if (game.step >= ship.custom.troll_step) {
          ship.custom.troll = true;
          color_echo_with_name("Troll:", index + 1, ship.name, "Tomato");
          if (!ship.custom.troll_warning) {
            ship.custom.troll_warning = true;
            warn(ship, 6);
            resetShip(ship);
          } else {
            kick(ship);
          }
        }
      }
    } else {
      ship.custom.troll_step = 0;
      if (ship.custom.troll) {
        ship.custom.troll = false;
        // color_echo_with_name("Troll is gonna AFK:", index + 1, ship.name, "Orange");
      }
    }
  }

  if (ship.custom.lap_start != null)
  {
    var seconds = Math.floor((ship.game.step-ship.custom.lap_start-1+extra_bit)/60) ;
    if ((seconds>=5 || ship.custom.best_lap>10000) && seconds != ship.custom.seconds && ship.game.custom.status != "race_end")
    {
      ship.custom.seconds = seconds ;
      var minutes = Math.floor(seconds/60);
      seconds = seconds%60 ;
      if (seconds<10) seconds = "0"+seconds;
      lap_info.components[0].value = minutes+":"+seconds ;
      ship.setUIComponent(lap_info);
    }
  }
  else if (ship.game.custom.status == "qualification")
  {
    if (ship.custom.seconds != "Race for fastest lap")
    {
      ship.custom.seconds = "Race for fastest lap" ;
      lap_info.components[0].value = "Race for fastest lap" ;
      ship.setUIComponent(lap_info);
    }
  }
};

var createCheckPoint = function() {
  var x = game.ships[0].x;
  var y = game.ships[0].y;
  var direction = game.ships[0].r;
  // echo("{x:"+x+",y:"+y+",direction:"+direction+"}");
}

var extra_bit = 0 ;
var checkpoint_times = [] ;

var checkCheckPoint = function(ship,checkpoint) {
  var vx = Math.cos(checkpoint.direction);
  var vy = Math.sin(checkpoint.direction);
  var dx = ship.x-checkpoint.x;
  var dy = ship.y-checkpoint.y;
  var d = Math.sqrt(dx*dx+dy*dy);
  //echo(ship.y);
  var passed = false ;
  if (d<checkpoint.width)
  {
    var projection = vx*dx+vy*dy;
    //echo(projection);
    if (ship.custom.projection != null)
    {
      if (ship.custom.projection<0 && projection>=0)
      {
        passed = true ;
        extra_bit = (0-ship.custom.projection)/(projection-ship.custom.projection);
      }
    }
    ship.custom.projection = projection ;
  }
  return passed ;
}

var updateScoreboard = function(game) {
  scoreboard.components = [] ;
  var line = 0 ;
  if (game.custom.status == "qualification")
  {
    scoreboard.components.push({ type: "text",position: [0,line*10+1,100,8],color: "#FFF",value: "Qualification "+formatMinutesSeconds(game.custom.qualification_time)});
    line++ ;
  }
  else
  {
    scoreboard.components.push({ type: "text",position: [0,line*10+1,100,8],color: "#FFF",value: "Race" });
    line++ ;
  }
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    if (ship.custom.best_lap == null)
    {
      ship.custom.best_lap = 1000000 ;
    }
  }

  if (game.custom.status == "qualification")
  {
    game.ships.sort(function(a,b) { return a.custom.best_lap-b.custom.best_lap}) ;
  }
  else
  {
    game.ships.sort(function(a,b) {
      return (b.custom.checkpoint_count*1000-b.custom.checkpoint_time)-(a.custom.checkpoint_count*1000-a.custom.checkpoint_time);
    }) ;
  }

  var score = 10 ;
  var delta = 0 ;

  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    if (ship.score != score)
    {
      ship.set({score:score});
    }
    score = Math.max(0,score-1);
  }

  for (var i=0;i<game.ships.length;i++)
  {
    if (line>=10)
    {
      break ;
    }
    var ship = game.ships[i];
    if (game.custom.status != "qualification")
    {
      if (game.custom.status != "race_end" || ship.custom.lap_count>race_laps)
      {
        scoreboard.components.push({ type: "text", position: [0,line*10+1,14,8],color: "#FFF",align:"right",value:line+"."});
      }
      scoreboard.components.push({ type: "player",id: ship.id, position: [15,line*10+1.5,85,7],color: "#FFF",align:"left"});
      if (ship.custom.checkpoint_delta != null && ship.custom.checkpoint_delta>delta)
      {
        delta = ship.custom.checkpoint_delta ;
        scoreboard.components.push({ type: "text",position: [80,line*10+1,18,8],color: "#FFF",value: "+"+delta+"''",align:"right"});
      }
    }
    else
    {
      scoreboard.components.push({ type: "player",id: ship.id, position: [0,line*10+1.5,60,7],color: "#FFF",align:"left"});
      if (ship.custom.best_lap != null)
      {
        scoreboard.components.push({ type: "text",position: [60,line*10+1,38,8],color: "#FFF",value: formatLapTime(ship.custom.best_lap),align:"right"});
      }
    }
    line += 1 ;
  }
} ;

var updateShipInfo = function(ship, game) {

};

var game_reset = function(second) {
  setTrack(game, current_track);
  game.custom.status = "qualification" ;
  game.custom.closed = false;
  game.custom.status_time = second+qualification_duration ;
  var t = game.custom.status_time-second ;
  game.custom.qualification_time = t ;
  game.custom.lap_record = null;
  game.custom.enable_drs = true;
  game.custom.drs_step = game.step % drs_step;
  game.custom.enable_pitlane = false;
  allow_ship_switch = current_track != 3;
};

// game steps:
var manageGame = function(game,second) {
  if (game.custom.status == null)
  {
    game_reset(second);
  }
  switch (game.custom.status)
  {
    case "qualification":
      var t = Math.max(0,game.custom.status_time-second) ;
      game.custom.qualification_time = t ;
      if (t == 0)
      {
        game.custom.status = "race_start" ;
        game.custom.status_time = second+race_start_delay;
        race_info.components[0].value = "Prepare for race!";
        //game.setOpen(false) ;
        update_race_info(null, true);
        createStartingGrid(game);
        resetTrackResult(current_track);
        var ship = game.ships[0];
        if (ship != null && ship.custom.best_lap < 10000)
        {
          setQualificationBonus(current_track,ship.id,ship.name,2) ;  // ADDTHIS
        }
      }
      else if (game.step%240 == 0 && !race_info.components[0].value.startsWith("Qualifying session"))
      {
        race_info.components[0].value = "Qualifying session. Firstly carefully explore the map, and then show your maximum.";
        race_info.visible = true ;
        update_race_info();
      }
      break ;

    case "race_start":
      t = Math.max(0,game.custom.status_time-second) ;
      if (t<=race_start_timer)
      {
        countdown.components[0].value = t ;
        countdown.visible = true ;
        game.setUIComponent(countdown) ;
      }
      if (t == 0)
      {
        startRace(game) ;
        game.custom.status = "race" ;
      }
      break ;

    case "race":
      if (!game.custom.closed) {
        if (game.step > game.custom.close_step) {
          game.custom.closed = true;
        }
      }
      if (countdown.visible)
      {
        countdown.visible = false ;
        game.setUIComponent(countdown) ;
      }
      for (var i=0;i<game.ships.length;i++)
      {
        var ship = game.ships[i] ;
        if (ship.custom.lap_count>race_laps)
        {
          game.custom.status = "race_end" ;
          game.custom.status_time = second+time_after_race ;
          lap_info.components[0].value = "Checkered flag!" ;
          lap_info.visible = true ;
          ship.game.setUIComponent(lap_info);
        }
        else
        {
          var pos = (i+1);
          if (i<positions.length)
          {
            pos = positions[i];
          }
          var text = pos+" - Lap "+ship.custom.lap_count+"/"+race_laps ;
          if (ship.custom.race_info != text)
          {
            ship.custom.race_info = text ;
            race_info.components[0].value = text ;
            race_info.visible = true ;
            update_race_info(ship);
          }
        }
      }
      break ;

    case "race_end":
      t = Math.max(0,game.custom.status_time-second) ;
      for (var i=0;i<game.ships.length;i++)
      {
        var ship = game.ships[i] ;
        var text;
        if (ship.custom.lap_count>race_laps)
        {
          if (i==0)
          {
            text = "P1, P1! Good job, perfect race!";
          }
          else
          {
            if (i<positions.length)
            {
              text = positions[i]+ " Place! Podium, almost win. Next time, try to take 1st position:)";
            }
            else
            {
              text = "P"+(i+1)+"!"+" Good driving, man";
            }
          }
          if (!ship.custom.race_end) {
            ship.custom.race_end = true;
            spawnShip(ship, true);
            var points = point_system[i] || 0;
            setRacePoints(current_track,ship.id,ship.name,points) ;  // ADDTHIS
          }
        }
        else
        {
          var pos = (i+1);
          if (i<positions.length)
          {
            pos = positions[i];
          }
          text = pos+" - Lap "+ship.custom.lap_count+"/"+race_laps ;
        }
        if (ship.custom.race_info != text)
        {
          ship.custom.race_info = text ;
          if (t>30)
          {
            race_info.components[0].value = text ;
            race_info.visible = true ;
            update_race_info(ship);
          }
          lap_info.components[0].value = text ;
          lap_info.visible = true ;
          ship.setUIComponent(lap_info);
        }
      }
      if (t == 10)
      {
        race_info.components[0].value = "Checkered flag, Race End!";
        race_info.visible = true;
        update_race_info(null, true);

        // echo(JSON.stringify(global_results));
        // echo(JSON.stringify(createResultTable()));
        hide_spawn_objects(game);
        displayChampionshipTable(createResultTable());  // ADDTHIS
      }
      if (t == 3)
      {
        race_info.components[0].value = "Next Race!";
        race_info.visible = true;
        update_race_info();
      }
      if (t == 0)
      {
        hideChampionshipTable() ;  // ADDTHIS
        game.custom.status = "qualification" ;
        game.custom.closed = false;
        game.custom.status_time = second+qualification_duration ;
        game.custom.lap_record = null;
        game.custom.enable_drs = true;
        game.custom.drs_step = game.step % drs_step;
        game.custom.enable_pitlane = false;
        game.setOpen(true);
        current_track = (current_track+1)%tracks.length;
        setTrack(game,current_track);
        allow_ship_switch = current_track != 3;

        for (var i=0;i<game.ships.length;i++)
        {
          var ship = game.ships[i] ;
          ship.custom.current_checkpoint = null;
          ship.custom.lap_count = 0 ;
          ship.custom.checkpoint_count = 0 ;
          ship.custom.checkpoint_time = 0 ;
          ship.custom.lap_start = null;
          ship.custom.race_end = false;
          spawnShip(ship);
          var rank = i<positions.length? positions[i] : ((i+1)+"th");
          var lap = formatLapTime(ship.custom.best_lap) ;

          ship.intermission({
            "Your rank": rank,
            "Your best lap": lap
          }) ;
          ship.custom.best_lap = 100000 ;
        }
      }
      break ;
  }
};

var changeShip = function(ship) {
  if (ship.custom.allow_switch && !(ship.custom.next_switch_step > game.step)) {
    ship.custom.next_switch_step = game.step + ship_switch_delay;
    var max_ship_num = 6;
    var level = Math.floor(ship.type / 100);
    var next_type = ((ship.type - 1) % 100 + 1) % max_ship_num + 1 + level * 100;
    ship.set({type: next_type});
  }
};


//!
var spawnShip = function(ship, idle) {
  // get random position on spawn-zone
  do {
    var spawn_pos = outlap.spawn_zone[Math.floor(Math.random() * outlap.spawn_zone.length)];
    // skip positions taken by other ships
    for (var test_ship of game.ships) {
      if (
        test_ship !== ship
        && test_ship.custom.on_spawn_zone
        && Math.abs(test_ship.custom.safe_lap_map_pos.x - spawn_pos.x) < lap_map_precision
        && Math.abs(test_ship.custom.safe_lap_map_pos.y - spawn_pos.y) < lap_map_precision
      ) {
        spawn_pos = null;
        break;
      }
    }
  } while (spawn_pos == null);
  pos = outlap.game_pos(spawn_pos);
  if (current_track == 3) {
    ship.set({x: pos.x, y: pos.y, vx: 0, vy: 0, idle: !!idle, generator: 300, type: 202});
  } else {
    ship.set({x: pos.x, y: pos.y, vx: 0, vy: 0, idle: !!idle, generator: 300});
  }
  ship.custom.on_spawn_zone = true;
  if (idle) {
    setTimeout(function() {
      ship.set({vx: 0, vy: 0});
    }, 1000 * 2);
  }
}

var resetShip = function(ship) {
  spawnShip(ship);
  if (ship.game.custom.status == "qualification") {
    ship.custom.current_checkpoint = 0;
    ship.custom.checkpoint_delta = 0;
    ship.custom.lap_start = null;
  } else {
    if (ship.custom.current_checkpoint == checkpoints.length - 1) {
      ship.custom.current_checkpoint--;
    }
  }
}

var createStartingGrid = function(game) {
  afk_check.disable(true);
  game.custom.lap_record = null;
  game.custom.enable_drs = false;
  allow_ship_switch = false;
  if (enable_pitlane) {
    game.custom.enable_pitlane = true;
    game.custom.pitlane_step_1 = game.step % pitlane_step;
    game.custom.pitlane_step_2 = (game.step + pitlane_span) % pitlane_step;
  }
  
  if (current_track == 1 || current_track == 0) {
    var x = -120 ;// Pole position ship X coordinate
    for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.custom.current_checkpoint = 0 ;
      ship.custom.lap_count = 0 ;
      ship.custom.checkpoint_count = 0 ;
      ship.custom.checkpoint_time = 0 ;
      ship.custom.lap_start = null ;
      ship.custom.checkpoint_delta = 0 ;
      ship.emptyWeapons();
      if (i%2 ==0)
      {
        ship.set({x:x,y:-225,vx:0,vy:0,idle:true,angle:180,generator:200}) ;
      }
      else
      {
        ship.set({x:x,y:-255,vx:0,vy:0,idle:true,angle:180,generator:200}) ;
      }
      x = Math.max(-120,x+10); // (Pole position coordinate, x+10 / x-10 distance with position down)
    }
  }
  else {
    var x = 39 ;// Pole position ship X coordinate
  
    for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.custom.current_checkpoint = 0 ;
      ship.custom.lap_count = 0 ;
      ship.custom.checkpoint_count = 0 ;
      ship.custom.checkpoint_time = 0 ;
      ship.custom.lap_start = null ;
      ship.custom.checkpoint_delta = 0 ;
      ship.emptyWeapons();
      if (i%2 ==0)
      {
        ship.set({x:x,y:-225,vx:0,vy:0,idle:true,angle:0,generator:200}) ;
      }
      else
      {
        ship.set({x:x,y:-255,vx:0,vy:0,idle:true,angle:0,generator:200}) ;
      }
      x = Math.min(39,x-10); // (Pole position coordinate, x+10 / x-10 distance with position down)
    }
  }
}

var startRace = function(game) {
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    ship.set({idle:false}) ;
    ship.custom.current_checkpoint = 0 ;
    ship.custom.lap_count = 0 ;
    ship.custom.checkpoint_count = 0 ;
    ship.custom.checkpoint_time = 0 ;
    ship.custom.lap_start = null ;
    ship.custom.checkpoint_delta = 0 ;
    ship.custom.best_lap = 100000;
  }
  checkpoint_times = [] ;
  afk_check.enable(true);
  game.custom.close_step = game.step + race_close_time - 1;
}


// Reset game if mod was edited while running
if (game.step > 0) {
  game_reset(game.step / 60);
  for (var ship of game.ships) {
    resetShip(ship);
  }
}


this.options = {
  map_size: map_size,
  weapons_store: false,
  radar_zoom: 1,
  crystal_value: 0,
  ships: ships,
  choose_ship: vehicle_type,
  reset_tree: true,
  asteroids_strength: 1e10,
  starting_ship: 800,
  auto_refill: false,
  projectile_speed: 3,
  speed_mod: 1,
  starting_ship_maxed: true,
  power_regen_factor: 0,
  // custom_map: map,
  custom_map: "",
  invulnerable_ships: true,
  max_players: 12,
  mines_destroy_delay: 60*50,
  soundtrack: "crystals.mp3",
  vocabulary: vocabulary
};


var tick = function(game) {
  // if (game.collectibles.length<collectibles)
  // {
  //   popCollectible(game);
  // }
  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    checkShip(ship, i);
  }
  if (game.step%60 == 0)
  {
    manageGame(game,game.step/60) ;
    updateScoreboard(game);

   for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.setUIComponent(scoreboard);
      // updateShipInfo(ship, game);
    }
  }

  // Collectibles

  // DRS
  if (game.custom.enable_drs) {
    if (game.step % drs_step == game.custom.drs_step) {
      //DRSZONE 1
      game.addCollectible({code:90,x:-215,y:10});
      game.addCollectible({code:90,x:-185,y:10});
      game.addCollectible({code:90,x:-155,y:10});
      game.addCollectible({code:90,x:-125,y:10});
      game.addCollectible({code:90,x:-95,y:10});
      game.addCollectible({code:90,x:-65,y:10});
      //DRSZONE 2
      game.addCollectible({code:90,x:140,y:-240});
      game.addCollectible({code:90,x:170,y:-240});
      game.addCollectible({code:90,x:200,y:-240});
      game.addCollectible({code:90,x:230,y:-240});
      game.addCollectible({code:90,x:260,y:-240});
      // OVAL 
      game.addCollectible({code:90,x:265,y:245});
      game.addCollectible({code:90,x:235,y:245});
      game.addCollectible({code:90,x:205,y:245});
      game.addCollectible({code:90,x:175,y:245});
      game.addCollectible({code:90,x:145,y:245});
      game.addCollectible({code:90,x:115,y:245});
    }
  }

  // PitLane
  if (game.custom.enable_pitlane) {
    var step = game.step % pitlane_step;
    if (step == game.custom.pitlane_step_1) {
      game.addCollectible({code:20,x:Wx+30,y:Wy});
      game.addCollectible({code:11,x:Wx+20,y:Wy});
      game.addCollectible({code:20,x:Wx-20,y:Wy});
      game.addCollectible({code:11,x:Wx+30,y:Wy});
    } else if (step == game.custom.pitlane_step_2) {
      game.addCollectible({code:10,x:Wx+30,y:Wy});
      game.addCollectible({code:21,x:Wx+20,y:Wy});
      game.addCollectible({code:10,x:Wx-20,y:Wy});
      game.addCollectible({code:21,x:Wx-30,y:Wy});
    }
  }
};

this.tick = function(game_arg) {
  game = game_arg;
  this.tick = tick;
  this.tick(game);
};


this.event = function(event,game) {
  switch (event.name) {
    case "ui_component_clicked":
      var ship = event.ship;
      var component = event.id;
      if (component == "change" && ship != null) {
        changeShip(ship);
      }
      break;
  }
};


// ADDTHIS all below is the required functions for circular championship
var global_results = [] ;

for (var i=0;i<tracks.length;i++)
{
  global_results[i] = {} ;
}

var setPlayerResult = function(track,id,name,type,value) {
  var key = id+name ;
  var res = global_results[track][key] ;
  if (res == null) {
    res = global_results[track][key] = {
      id: id,
      name: name,
    } ;
  }
  res[type] = value ;
}

var setQualificationBonus = function(track,id,name,bonus) {
  setPlayerResult(track,id,name,"bonus",bonus) ;
}

var setRacePoints = function(track,id,name,points) {
  setPlayerResult(track,id,name,"points",points) ;
}

var resetTrackResult = function(track) {
  global_results[track] = {} ;
}

var createResultTable = function() {
  var players = {} ;
  var table = [] ;
  var online_ships = [];
  for (var ship of game.ships) {
    online_ships.push(ship.id);
  }
  for (var i=0;i<tracks.length;i++)
  {
    var keys = Object.keys(global_results[i]) ;
    for (var k=0;k<keys.length;k++)
    {
      var key = keys[k] ;
      var res = global_results[i][key] ;
      if (!online_ships.includes(res.id)) {
        continue;
      }

      if (players[key] == null)
      {
        players[key] = {
          name: res.name,
          id: res.id,
          points: [],
          bonus: [],
          total: 0
        }
        table.push(players[key]);
      }

      players[key].points[i] = res.points;
      players[key].bonus[i] = res.bonus;
      players[key].total += (res.points || 0) + (res.bonus || 0);
    }
  }


  table.sort(function(a,b) { return b.total-a.total ; }) ;
  return table ;
} ;

var championshipTable = {
  id:"championship_table",
  visible: true,
  position: [20,20,60,60],
  components: []
} ;

var displayChampionshipTable = function(table) {
  championshipTable.components = [] ;
  championshipTable.visible = true ;
  var line = 0 ;
  var line_h = 100/17 ;

  championshipTable.components.push({ type: "text",position: [0,line_h*.1,100,line_h*1.5],color: "#FFF",value: "CHAMPIONSHIP STANDINGS"});

  line = 2 ;
  championshipTable.components.push({ type: "box",position: [0,line_h*(line+.1),100,line_h*.9],fill:"hsla(200,50%,50%,.5)"});

  championshipTable.components.push({ type: "text",position: [1,line_h*(line+.1),38,line_h*.9],align:"left",fill:"rgba(255,255,255,.2)",color: "#FFF",value: "PILOT"});
  championshipTable.components.push({ type: "text",position: [40,line_h*(line+.1),9,line_h*.9],fill:"rgba(255,255,255,.2)",color: "#FFF",value: "RACE"});

  var race_w = 40/tracks.length ;
  for (var i=0;i<tracks.length;i++)
  {
    var x = 50+i*race_w ;
    championshipTable.components.push({ type: "text",position: [x,line_h*(line+.1),race_w-1,line_h*.9],fill:"rgba(255,255,255,.2)",color: "#FFF",value: (i+1)});
  }
  championshipTable.components.push({ type: "text",position: [90,line_h*(line+.1),10,line_h*.9],fill:"rgba(255,255,255,.2)",color: "#FFF",value: "POINTS"});

  for (var p=0;p<Math.min(14,table.length);p++)
  {
    line += 1 ;
    var player = table[p] ;
    championshipTable.components.push({ type: "box",position: [0,line_h*(line+.1),100,line_h*.9],fill:"hsla(200,50%,30%,.5)"});
    championshipTable.components.push({ type: "player",id: player.id, position: [1,line_h*(line+.1),38,line_h*.9],align:"left",fill:"rgba(255,255,255,.2)",color: "#FFF",value:player.name});
    for (var i=0;i<tracks.length;i++)
    {
      var x = 50+i*race_w ;
      var value = player.bonus[i]>0 ? (player.points[i]||0)+"+"+player.bonus[i] : player.points[i];
      if (value != null) {
        championshipTable.components.push({ type: "text",position: [x,line_h*(line+.1),race_w-1,line_h*.9],fill:"rgba(255,255,255,.2)",color: "#FFF",value: value });
      }
    }
    championshipTable.components.push({ type: "text",position: [90,line_h*(line+.1),10,line_h*.9],fill:"rgba(255,255,255,.2)",color: "#FFF",value: player.total });
  }

  var x = 50+current_track*race_w ;
  championshipTable.components.push({ type: "box",position: [x,line_h*2,race_w,line_h*(line-1)],fill:"hsla(200,50%,100%,.2)"});

  for (var i=0;i<game.ships.length;i++)
  {
    var ship = game.ships[i];
    ship.setUIComponent(championshipTable);
  }
} ;

var hideChampionshipTable = function(table) {
  championshipTable.components = [] ;
  championshipTable.visible = false ;


    for (var i=0;i<game.ships.length;i++)
    {
      var ship = game.ships[i];
      ship.setUIComponent(championshipTable);
    }
};
