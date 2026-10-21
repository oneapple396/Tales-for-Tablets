'use strict';
const STORY = [
  {
    "title": "Johnny Builds to Mars",
    "text": "**JOHNNY BUILDS TO MARS**\r\n\r\n*A very big adventure for a very small astronaut.*"
  },
  {
    "title": "A Little Red Dot",
    "text": "\"One quiet night, Johnny spotted something strange in the sky.\r\n\r\nA tiny red dot glimmered between the stars.\r\n\r\n'What's that?' he wondered.\r\n\r\n'That's Mars,' said Dad. 'It's millions of miles away.'\r\n\r\nJohnny stared at the red dot.\r\n\r\n'Not for long,' he whispered.\""
  },
  {
    "title": "The Greatest Idea Ever",
    "text": "\"Johnny thought about Mars all night.\r\n\r\nHe imagined mountains taller than houses, valleys deeper than oceans, and skies the color of rusty pennies.\r\n\r\nThen he sat straight up in bed.\r\n\r\n'I know!' he shouted.\r\n\r\n'I'll build a rocket!'\r\n\r\nBiscuit opened one eye.\r\n\r\nHe did not look impressed.\""
  },
  {
    "title": "The Shopping List",
    "text": "\"The next morning, Johnny made a list.\r\n\r\nHe needed metal, wires, a window, and something very powerful for an engine.\r\n\r\nHe also wrote down three things he was absolutely certain he needed:\r\n\r\nA helmet.\r\n\r\nA flashlight.\r\n\r\nAnd a rubber duck.\r\n\r\n'For emergencies,' he explained.\r\n\r\nBiscuit sighed.\""
  },
  {
    "title": "Treasure Hunting",
    "text": "\"Johnny searched every corner of the house.\r\n\r\nUnder the stairs, he found an old toolbox.\r\n\r\nIn the attic, he discovered a dusty metal fan.\r\n\r\nBehind the washing machine, he found something that might have been a spaceship part.\r\n\r\nOr possibly a toaster.\r\n\r\n'Perfect!' said Johnny.\r\n\r\nBiscuit sneezed.\""
  },
  {
    "title": "Welcome to Mission Control",
    "text": "\"By lunchtime, Johnny had gathered everything he needed.\r\n\r\nWell, almost everything.\r\n\r\nHe rolled his wagon into the garage and spread his treasures across the floor.\r\n\r\n'Welcome to Mission Control!' he announced.\r\n\r\nBiscuit looked around.\r\n\r\nMission Control smelled like old paint and lawn fertilizer.\""
  },
  {
    "title": "Building the Rocket",
    "text": "\"Johnny began with the body.\r\n\r\nHe hammered, twisted, tightened, and measured.\r\n\r\nSometimes he measured twice.\r\n\r\nSometimes he forgot to measure at all.\r\n\r\nBy sunset, something enormous stood in the garage.\r\n\r\nIt was tall.\r\n\r\nIt was shiny.\r\n\r\nAnd it leaned slightly to the left.\""
  },
  {
    "title": "A Rocket Needs Personality",
    "text": "\"'Every great spaceship needs a name,' Johnny declared.\r\n\r\nHe painted a bright red stripe along the side.\r\n\r\nThen he added a lightning bolt.\r\n\r\nThen another lightning bolt.\r\n\r\nFinally, he wrote:\r\n\r\nTHE RED COMET\r\n\r\nBiscuit inspected the paint.\r\n\r\nAnd immediately stepped in it.\""
  },
  {
    "title": "The Inspector",
    "text": "\"Biscuit walked slowly around the rocket.\r\n\r\nHe sniffed the engine.\r\n\r\nHe examined the wings.\r\n\r\nHe stared at a loose screw.\r\n\r\nThen he sat down and gave Johnny a long, serious look.\r\n\r\n'You think it's safe?' Johnny asked.\r\n\r\nBiscuit barked once.\r\n\r\nJohnny decided that meant yes.\""
  },
  {
    "title": "The Countdown",
    "text": "\"At last, everything was ready.\r\n\r\nJohnny climbed into the cockpit and fastened his seat belt.\r\n\r\nHe put on his helmet.\r\n\r\nHe checked the controls.\r\n\r\n'Ten... nine... eight...'\r\n\r\nBiscuit suddenly jumped into the seat beside him.\r\n\r\n'Seven... six... five...'\r\n\r\n'Wait,' said Johnny. 'YOU'RE COMING?'\""
  },
  {
    "title": "BLAST OFF!",
    "text": "\"'Three... two... ONE!'\r\n\r\nWHOOOOOOOSH!\r\n\r\nThe rocket roared.\r\n\r\nThe windows rattled.\r\n\r\nThe ground trembled.\r\n\r\nAnd with one enormous burst of fire, the Red Comet shot into the sky!\r\n\r\n'WE'RE FLYING!' Johnny shouted.\r\n\r\nBiscuit closed his eyes.\""
  },
  {
    "title": "Goodbye, Earth!",
    "text": "\"Before long, the houses looked like toys.\r\n\r\nThe roads looked like ribbons.\r\n\r\nAnd the oceans looked like enormous blue puddles.\r\n\r\nJohnny pressed his nose against the window.\r\n\r\n'Look, Biscuit! That's Earth!'\r\n\r\nBiscuit floated past him.\r\n\r\nUpside down.\r\n\r\nStill unimpressed.\""
  },
  {
    "title": "The Long Way to Mars",
    "text": "\"Space was enormous.\r\n\r\nJohnny passed glittering stars, drifting rocks, and a comet with a magnificent silver tail.\r\n\r\nHe checked his map.\r\n\r\nMars was getting closer.\r\n\r\n'Almost there!' he cheered.\r\n\r\nBiscuit looked at the empty food bowl.\r\n\r\nHe had other concerns.\""
  },
  {
    "title": "Welcome to Mars",
    "text": "\"The Red Comet shuddered as it entered the Martian sky.\r\n\r\nRed mountains rose beneath them.\r\n\r\nDust swirled across the rocky ground.\r\n\r\nJohnny gripped the controls.\r\n\r\n'Steady... steady...'\r\n\r\nTHUMP!\r\n\r\nThey had landed.\r\n\r\nOn Mars.\r\n\r\nFor real.\""
  },
  {
    "title": "One Small Step",
    "text": "\"Johnny climbed down the ladder.\r\n\r\nHe stepped onto the rusty red ground.\r\n\r\n'One small step for Johnny,' he announced.\r\n\r\n'One giant leap for—'\r\n\r\nBiscuit bounded past him, kicking dust everywhere.\r\n\r\nJohnny sighed.\r\n\r\n'Never mind.'\""
  },
  {
    "title": "The Terrible Discovery",
    "text": "\"Johnny gazed proudly across the endless red desert.\r\n\r\nHe had built a rocket.\r\n\r\nHe had flown through space.\r\n\r\nHe had landed on another planet.\r\n\r\nThere was only one problem.\r\n\r\nHis stomach growled.\r\n\r\nJohnny opened his backpack.\r\n\r\nA flashlight.\r\n\r\nA notebook.\r\n\r\nA rubber duck.\r\n\r\nBut no sandwiches.\r\n\r\nNo cookies.\r\n\r\nNot even a single cracker.\r\n\r\nJohnny stared at Biscuit.\r\n\r\nBiscuit stared at Johnny.\r\n\r\n'Uh-oh,' said Johnny.\r\n\r\n**'WE FORGOT THE SNACKS!'**\"\n\nTHE END\n\nNext time, pack lunch."
  }
];

// Local illustration metadata; manuscript above remains unchanged.
const ILLUSTRATION_ALTS = [
 'Johnny and Biscuit stand beside their homemade rocket under a starry backyard sky.',
 'Dad points to Mars as Johnny looks through a telescope and Biscuit watches.',
 'Johnny sketches his rocket in bed while Biscuit lies unimpressed on the rug.',
 'Johnny writes a list beside a helmet, flashlight, and yellow rubber duck.',
 'Johnny finds supplies in a dusty attic while Biscuit sneezes beside the wagon.',
 'Johnny welcomes Biscuit into their warm garage with a wagon full of supplies.',
 'Johnny uses a wrench to assemble a silver rocket from mismatched metal panels.',
 'Johnny paints the rocket while Biscuit leaves red pawprints across the garage.',
 'Biscuit inspects a loose screw as Johnny waits with a screwdriver.',
 'Helmeted Johnny and Biscuit prepare for launch in the glowing rocket cockpit.',
 'The homemade rocket rises above the neighborhood through billowing smoke.',
 'Biscuit floats upside down while Johnny looks out at blue Earth.',
 'Johnny steers toward Mars while Biscuit considers his empty food bowl.',
 'The rocket touches down amid red Martian rocks and swirling dust.',
 'Johnny takes his first steps while Biscuit bounds past, leaving tracks in red dust.',
 'Johnny and Biscuit discover a flashlight, notebook, and rubber duck—but no snacks.'
];
STORY.forEach((page,index)=>{
 page.image=index===0?'assets/illustrations/cover-full-page.jpg':'assets/illustrations/page-'+String(index+1).padStart(2,'0')+'-full.jpg';
 page.alt=ILLUSTRATION_ALTS[index];
});
