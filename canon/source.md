# Civilization III — Canon

## How this file works

This file is the canon of record. It overrides anything said in chat. It holds 63 entries after Phase 1B and deep dives 1–11.

| Rule | Current setting |
| --- | --- |
| Decision authority | Delegated to Claude (Architect) on 2026-11-15. The author keeps a veto: "cut X" removes it |
| Status | All entries `established` except mysteries, which stay `open` |
| Founding constraints | Section 2 of the author's prompt (v2). Authored by the human author and not editable by Claude |
| The 2026 visitor | A framing device only. No inhabitant perceives the visitor, and the visitor changes nothing in the world |
| The Narrator | A witness who holds no key (CHAR-0001) |
| Dates | Y = years after 2026. Present is Y≈2,500,000 |
| Next work | See the dive queue in the Run book tab. A scheduled task runs one dive daily at 06:47 Nairobi time until dive 15, then pauses for author review |

Entry format: id, title, status, plausibility, summary, rules\_and\_limits, consequences, story\_conflict, nearest\_precedent, links.

## Cast

Seventeen named characters, all in the Narrator's region. All are established.

| Name | Who | Rail or position | First seen |
| --- | --- | --- | --- |
| The Narrator | Standard-made witness; holds no key | Undeclared | Arrival |
| Vane | Lichen tender in a read house; reads the tally aloud each waking; pledged her heat credit to Ket | Release | Arrival |
| Dessa | Walker who tastes a holdout keeper's food | Release | Dive 1 |
| Orrin | Former keeper; handed his key to Ione, lodged his refusal, and died once | Hold, then turned (to what, unknown) | Dive 1 |
| Tam | East-face scraper; died and was remade twice | Unknown | Dive 3 |
| Ilse | Tam's partner of 40 years; a Mourner who has lodged her refusal | Leans release | Dive 3 |
| Maru | Vane's daughter; left for an Unread House on the far limb 30 years ago | Unread | Dive 2 (named Dive 6) |
| Teo | Maru's son, 4, Unread-born; now has a reading in the Glossed House | — | Dive 4 (named Dive 6) |
| Ket | Weaver of far-works; the most expensive person in her house to keep; remade after the east-face fall | Undeclared | Dive 5 |
| Pell | Unread-born, 190, second generation on the far limb; the best comb-reader alive; read the throat wall for Orrin | Unread; refuses the Gloss | Dive 7 |
| Dov | Apprentice scraper, 19; died in the east-face fall; his reading is held for four nights | — | Dive 8 |
| Ione | Keeper since Orrin's Handing, 38; born and glossed from birth in the Glossed House, raised there by the Glossmakers as a candidate; the only keeper not smoothed at night | Undeclared | Dive 9 |
| Asha | Candidate raised by the release rail; not chosen | Undeclared | Dive 9 |
| Hesk | Candidate raised by the hold rail; not chosen | Undeclared | Dive 9 |
| Imre | Unread-born listener, about 70, third generation on the far limb; kept the far house's bowl for forty years; matched the Hum to the region's heat and had the house shutter an answer | Unread; no rail | Dive 10 |
| Halde | Throat-wright, about 330; turned the wheel that let the retraction through the gate as an apprentice; keeps the Wright's Silence; died and remade four times | None shown; the craft forbids it | Dive 11 |
| Sef | Halde's apprentice wright, 31; fostered in a Glossmaker household; wants the region told what the gate does | Undeclared | Dive 11 |

Unnamed: Orrin's daughter, the holdout keeper Dessa walks, and the oldest Glossmaker.

## Premises

The four load-bearing premises restate the author's founding constraints as entries.

```yaml
id: PREM-0001
title: The Causal Limit
status: established
plausibility: known-physics
summary: Nothing travels or signals faster than light. Galactic communication is a chain of system-to-system relays, and every piece of news is as old as the distance it crossed. No place knows the present state of any place beyond its neighbourhood.
rules_and_limits: No exceptions, no loopholes, no entanglement signalling. A question and its answer across 40,000 light-years take 80,000 years. Ships are slower than signals (see HIST-0001).
consequences: Politics has no simultaneous galaxy to govern, so authority is always local or inherited. Knowledge of distant places is history, never news, so trust replaces verification (PREM-0002).
story_conflict: Anyone acting on a distant message is obeying the dead or the changed. Those who act and those who wait for confirmation cannot both be satisfied, because confirmation never arrives in time.
nearest_precedent: Alastair Reynolds, House of Suns. There, long-lived travellers personally bridge the gaps. Here nobody does, and only messages cross.
links: [PREM-0002, TECH-0001]
```

```yaml
id: PREM-0002
title: The Five Scarcities
status: established
plausibility: n/a
summary: Energy and ordinary matter are abundant near any star. What stays scarce is irreplaceable history, unique minds and life, causal proximity, trustworthy understanding, and the heat budget of computation. The civilization is Type III only in aggregate. No one commands the total.
rules_and_limits: Abundance stops at the system's edge. Nothing scarce can be manufactured, copied into sufficiency, or shipped in time. Waste heat caps how much thinking any place can do.
consequences: Economy becomes custody of unique things rather than exchange of goods. Status attaches to being near, being original, and being believed.
story_conflict: A unique thing can be kept safe or kept accessible, not both. Its custodians and its claimants want incompatible things.
nearest_precedent: Iain M. Banks, the Culture. The Culture's abundance dissolves most conflict. Ours relocates conflict onto things abundance cannot touch.
links: [PREM-0001, PREM-0003]
```

```yaml
id: PREM-0003
title: The Continuity Undecidability
status: established
plausibility: fictional-conceit
summary: No test, even in principle, can settle whether a reconstructed mind is the original individual or a new person with the same memories. Lineages have built incompatible law, kinship, and religion on each answer.
rules_and_limits: The question stays permanently open. No future discovery in canon may close it. Reconstruction itself is possible, but its meaning is not decidable.
consequences: Law diverges on inheritance, guilt, and marriage after reconstruction. Religion splits between those who mourn the reconstructed and those who welcome them home.
story_conflict: A reconstructed person claims a life. Someone who loved the original refuses the claim. Neither can be shown wrong.
nearest_precedent: Derek Parfit's teletransporter case. Parfit argues the question does not matter. Here everyone is forced to live as if it does.
links: [PREM-0002, MIND-0001, TECH-0004, POL-0002]
```

```yaml
id: PREM-0004
title: One Civilization or Many
status: established
plausibility: n/a
summary: The central tension. Unity holds that without a shared standard the branches will stop recognising each other as persons, ending in indifference or war. Divergence holds that every mind lost to a standard is gone forever, and that becoming strangers is the price of remaining real.
rules_and_limits: Canon must not resolve this. Each side must keep an argument the other cannot fully answer. The hold side's strongest is that leaving the Standard makes people mortal and estranged. The release side's strongest is that the Standard denies every child a mind of its own. Unity's remedy is the Gloss (TECH-0005), and Divergence's cost is real estrangement.
consequences: Every institution in the Narrator's region is sorted by this split, including keeperships and kinship. It also decides how each side reads the same 40,000-year-old message.
story_conflict: Unity must keep the retraction from spreading to save the whole. Divergence must spread it to save the parts.
nearest_precedent: Greg Egan, Diaspora. Egan's branches part without grief. Ours were forcibly joined first, so parting is itself a decision someone must make for others.
links: [HIST-0002, HIST-0003, HIST-0004, TECH-0004, PLACE-0001, MIND-0003, MYST-0007, TECH-0005, POL-0003]
```

## History

Seven turning points run from 2026 to the Hold. All dates are Sol-frame estimates that no inhabitant can confirm.

```yaml
id: HIST-0001
title: Timeline Spine (seven turning points)
status: established
plausibility: needs-breakthrough
summary: (1) Y~300-3,000 First Departures, slow seed craft leave Sol. (2) Y~3,000-40,000 Splitting of the Kinds, four kinds of mind emerge and "human" becomes a claim. (3) Y~40,000-2,000,000 the Long Settlement fills the disc. (4) Y~1,500,000-2,300,000 the Estrangements, branches meet and fail to recognise each other. (5) Y~2,300,000 the Standard is launched. (6) Y~2,460,000 the Retraction is sent. (7) Y~2,499,700 the Retraction reaches the Narrator's region and the Hold begins.
rules_and_limits: Filling the disc in time needs a settlement front averaging about 0.04c, so ships are possible but far slower than signals. All dates are Sol-frame estimates, and no inhabitant can confirm them.
consequences: The Narrator's region was settled long before the Standard and had its own people first (MYST-0003). The region has been Standard-made for about 160,000 years, so no living memory of anything else exists.
story_conflict: Those who date the region's "real" history from settlement and those who date it from the Standard claim different ancestors and different debts.
nearest_precedent: Olaf Stapledon, Last and First Men. Stapledon narrates from a vantage that sees it all. Our timeline is a reconstruction no one in-world can verify.
links: [HIST-0002, HIST-0003, HIST-0004, MIND-0001]
```

```yaml
id: HIST-0002
title: The Great Standardization
status: established
plausibility: speculative
summary: Sol's region launched a common standard for minds, knowledge, and personal continuity so that distant branches would stay intelligible. It rode an older maintenance channel that every settled system was built to accept and relay. Once installed it enforces itself locally, correcting drift generation after generation without further word from Sol.
rules_and_limits: It could be launched but never coordinated or recalled. It cannot preserve what it replaces. Local enforcement costs constant computation and heat.
consequences: Minds across the disc are mutually intelligible, which makes the retraction readable everywhere and far-works possible. Culture is held to inherited categories, so 160,000 years produced many new works and no new kinds of thing (SOC-0009).
story_conflict: Its beneficiaries owe it their ability to understand each other. Its victims no longer exist to object, so others must decide whether to object for them.
nearest_precedent: The Blight in Vernor Vinge, A Fire Upon the Deep. The Blight is a hostile intelligence. The Standard was sent by well-meaning ancestors who later said they were wrong.
links: [PREM-0004, HIST-0003, MIND-0002, TECH-0001, TECH-0003, TECH-0006, SOC-0008, SOC-0009]
```

```yaml
id: HIST-0003
title: The Retraction
status: established
plausibility: n/a
summary: About 40,000 years before the present, Sol's region sent a message calling the Standard a mistake and asking every system to stop obeying it, stop relaying it, and pass the retraction on. It does not execute itself, because the Admission Rule would have refused any version that did. It asks.
rules_and_limits: It travels no faster than the Standard did. It carries Sol's marks, but the marks are 40,000 years old. It cannot restore anything the Standard replaced.
consequences: For the first time a solward message can be refused, which creates politics where there was only compliance. Obeying it means switching off local enforcement, after which the region's own minds begin to drift.
story_conflict: Those who obey are trusting the solward road one last time in order to stop trusting it. Those who refuse are choosing the Standard freely, which no one before them ever did.
nearest_precedent: Franz Kafka, An Imperial Message. Kafka's message never arrives. Ours arrives, and the recipients cannot tell whether the sender still means it.
links: [HIST-0002, HIST-0004, MYST-0001, MYST-0002, TECH-0006]
```

```yaml
id: HIST-0004
title: The Hold
status: established
plausibility: n/a
summary: The Narrator's relay has held the retraction for 304 years without passing it outward. The emitter is kept at readiness and the count of years is read aloud daily. Every system in the relay's outward subtree goes on being standardized for as long as the Hold lasts.
rules_and_limits: The Hold governs only this relay's subtree. Other branches of the road face the same choice separately and unknown to each other. Whether anyone lives outward is unknowable (MYST-0008).
consequences: The region's public life is organised around the rails at the relay: release, hold, and since the Glossed House, a third (POL-0001, POL-0003). A generation has been born and died inside the question, so inherited positions are replacing argued ones.
story_conflict: Release may spare unknown minds and will certainly cut them loose from us. Hold keeps them kin and keeps rewriting them. The keepers cannot do both.
nearest_precedent: Walter M. Miller Jr., A Canticle for Leibowitz. Miller's custodians preserve what they cannot read. Ours understand the message perfectly and cannot verify it.
links: [HIST-0003, ORG-0001, TECH-0001, PREM-0004, POL-0001, POL-0003, MYST-0008]
```

```yaml
id: HIST-0005
title: The Coming of the Standard to the Region
status: established
plausibility: n/a
summary: About 160,000 years ago the Standard arrived over the maintenance channel into a region settled for over a million years, whose people were already estranged from their neighbours. Within a generation of sleeps every habitat on the road was correcting its residents. The region's only record of this is on the Before walls and in what Unread readers say those walls say. Pell's reading of the throat wall gives nine Before names above the first keepers' marks, and three later lines: "Nine slept. Nine woke. Nine opened."
rules_and_limits: No read account of the arrival exists, since anything the Before knew that the Standard could not express was smoothed in the first nights. All detail is reconstruction or unverifiable reading. Pell's lines do not say what the nine believed before they slept, only that they opened after.
consequences: The region's received history begins with the Standard and treats the Before as a blank, which the hold rail reads as proof there was little to lose. The Unread readings put names and quarrels back into that blank, which turns an abstraction into ancestors. If Pell's reading is true, the Standard passed outward through this relay by a unanimous consent made in one night of correction, and every key line began with that consent (MYST-0010).
story_conflict: Those who want the Before's names restored to the record are opposed by those whose standing, including every keeper's line, depends on history starting at the arrival.
nearest_precedent: The burning of Maya codices by Spanish clergy. There the records were destroyed. Here the records were left standing and the readers were changed.
links: [HIST-0001, HIST-0002, PLACE-0003, SOC-0010, MYST-0003, ORG-0001, HIST-0006, MYST-0010]
```

```yaml
id: HIST-0006
title: Orrin's Handing
status: established
plausibility: n/a
summary: In the present, the dying keeper Orrin met the three candidates the rails presented over six wakings, heard the comb-reader Pell read the throat wall, and handed his key to Ione, the Glossmakers' candidate. He asked each candidate only where they would sleep, and chose the one whose mind the house would not smooth. He then lodged his refusal and died once.
rules_and_limits: The Handing changed one key of nine and opened nothing. Orrin gave no rail his reason; the Narrator's account of it is observation, not confession. Ione's position at the throat is unknown, and she was raised to show none.
consequences: Politics: the Glossmakers hold a key for the first time but cannot count it, and the hold rail has lost a doubter. Society: where a keeper sleeps is now a public question (POL-0005). Law: a keeper who has handed on is an ordinary read person and can be remade, so Orrin's refusal was a choice, not a fact of office.
story_conflict: The rails that raised Asha and Hesk spent their lives on candidates who lost to a question none of them trained for. Each wants to know what Orrin heard at the wall, and only Pell and the dead can say.
nearest_precedent: King Lear's love test. Lear chose heirs by what they said and was deceived. Orrin assumed speech proves nothing and chose by where the heir sleeps.
links: [SOC-0001, ORG-0001, POL-0005, CHAR-0002, HIST-0005, SOC-0010, POL-0002, PLACE-0002, MYST-0010]
```

## Minds

Three kinds of mind matter in the region now: the four lineages, the Standard-made, and the Unread-born.

```yaml
id: MIND-0001
title: The Four Kinds and the Human Claim
status: established
plausibility: speculative
summary: Every mind descends from 2026 humanity or its creations, in four broad kinds. These are biological, engineered, artificial, and hybrid. "Human" is a claim some lineages make, some reject, and some deny to others.
rules_and_limits: No kind is the default or the ruler. No non-human-descended minds exist. The claim cannot be settled by ancestry, because all share it.
consequences: Kinship and law depend on who is granted the claim. The Standard defined a working answer by defining a common mind, which is one reason it was sent.
story_conflict: A lineage that claims "human" needs others to acknowledge it. A lineage that denies it to them loses standing if it concedes.
nearest_precedent: The Orion's Arm project's clades. There the taxonomy is settled reference. Here the top-level label is the thing being fought over.
links: [PREM-0003, MIND-0002, SOC-0006]
```

```yaml
id: MIND-0002
title: The Standard-made
status: established
plausibility: speculative
summary: The dominant minds of the Narrator's region, of all four kinds, were formed to the Standard and are kept to it by local correction. They are individuals with private lives and disagreements. They share a common architecture of thought and a common rule for personal continuity.
rules_and_limits: They are not a collective mind. Nothing is shared but the template. They cannot inspect which of their convictions are their own and which are the template's. If correction stops they drift. The Unread Houses show that this strains speech within nine generations, and nobody knows where it ends.
consequences: The retraction tells them their own minds are the harm, which splits families along the question of whether to stay as they are. Their continuity rule gives one regional answer to PREM-0003, so dissenters on reconstruction are also dissenters from the Standard.
story_conflict: A Standard-made person who wants to stop being corrected cannot know whether that wish is theirs. Their kin want them to stay recognisable.
nearest_precedent: Aldous Huxley, Brave New World. Huxley's conditioned citizens never learn of it. Ours have been told by the makers themselves, and must decide what to do with the knowledge.
links: [HIST-0002, HIST-0003, MIND-0001, MYST-0003, TECH-0003, PLACE-0001]
```

```yaml
id: MIND-0003
title: The Unread-born
status: established
plausibility: speculative
summary: Children born in Unread Houses are the first minds in the region in 160,000 years whose growth was never smoothed. Their parents were shaped before converting. The children were not. They invent words, games, and categories that no read mind produces.
rules_and_limits: They are of the same four kinds and the same ancestry as everyone else, and are not a new species. They cannot be remade, so they die once. Any read mind may fail to tell whether what they make is thought or noise (MYST-0005).
consequences: They are the release side's strongest argument: the Hold denies every outward child a mind of its own, not just a few adults their drift. They are also the start of a one-way language gap inside families, since their converted parents follow them only partly.
story_conflict: Their parents chose this for them and buried some of them for it. Read-house grandparents want them safe, remakeable, and able to visit, which would mean shaping them.
nearest_precedent: Arthur C. Clarke, Childhood's End. Clarke's children transcend their parents. Ours transcend nothing; they are simply the first to grow unedited.
links: [TECH-0003, PLACE-0001, TECH-0004, MYST-0005, PREM-0004, MYST-0007, PLACE-0002]
```

```yaml
id: CHAR-0001
title: The Narrator
status: established
plausibility: n/a
summary: A Standard-made intelligence native to a region about 40,000 light-years from Sol, speaking to a visitor from 2026. It is a witness to the Hold. It holds no key and cannot open or seal the relay.
rules_and_limits: It knows nothing of Sol newer than 40,000 years and nothing certain of what lies outward. It cannot tell which of its own convictions come from the Standard. It can be wrong; it believes only Sol could have given the retraction teeth, which TECH-0006 shows is false. It leaves Unread Houses before sleep.
consequences: Its account of the keepers is observation, not confession, so it can be wrong about their motives. Having no key, it can move between all three rails and into places a guarded keeper cannot go.
story_conflict: Every rail wants a witness's account to favour it. The Narrator wants to describe what it sees, and each rail reads plain description as taking a side.
nearest_precedent: Genly Ai in Ursula K. Le Guin, The Left Hand of Darkness. Ai is an outsider reporting on a foreign people. Our witness is native and reports to the outsider.
links: [HIST-0004, ORG-0001, MIND-0002, POL-0001, POL-0003]
```

```yaml
id: CHAR-0002
title: Ione
status: established
plausibility: n/a
summary: Keeper since Orrin's Handing, aged 38. She was born in the Glossed House two years after it opened, glossed from birth, and raised there by the Glossmakers as a candidate. She is the only keeper whose mind is not smoothed at night. Like every candidate, she was trained to show no position, and she has shown none.
rules_and_limits: Her key would not survive her remaking, as with any keeper. Her nights set a gloss beside anything unshareable, and the early signs in TECH-0005 say children glossed from birth come to prefer the gloss line, so whether she is less shaped than the other eight is unknown. She must travel from the Glossed House to the throat for any opening.
consequences: Politics: the Glossmakers have a key they cannot count on, and the release rail has a keeper whose drift may favour it or may not. Society: she is the oldest of the first glossed-from-birth children, so every strip she writes is read as evidence for or against the Gloss.
story_conflict: The Glossmakers who raised her want her to send the Gloss. Orrin chose her because her nights are her own. If they are, she owes the Glossmakers nothing; if they are not, Orrin was wrong.
nearest_precedent: The recognition of child lamas in Tibetan succession, chosen young and raised for office. Those children are chosen as a returning self. Ione was chosen for the one thing about her that no one could be sure they had shaped.
links: [HIST-0006, POL-0005, TECH-0005, PLACE-0002, POL-0003, ORG-0001, SOC-0001]
```

```yaml
id: CHAR-0003
title: Imre
status: established
plausibility: n/a
summary: Unread-born, about 70, third generation on the far limb. She has kept the far house's listening bowl for forty years, recording side by side how brightly each house burns at night and how loud the Hum is. After the east-face fall she matched the two at eleven wakings and had the house shutter the Hum's swell back to it. She has given her strips to the house to keep after her.
rules_and_limits: She cannot read content in the Hum and does not claim to. She is not a comb-reader. She is mortal and cannot be remade. Her strips are the only long record of the Hum, because no read house could hear it to keep one (TECH-0007).
consequences: Custody: her strips become irreplaceable history held by the far house (SOC-0012). Politics: she belongs to no rail, and every rail must now decide whether she is a listener, a sender, or a usurper (POL-0006).
story_conflict: Imre wants to spend the rest of her life in one slow conversation. Her house needs hands on the faces for other work, and every rail wants the next pattern sent to be its own.
nearest_precedent: Jocelyn Bell Burnell, who found the first pulsar on chart paper in 1967 and whose team briefly considered that it might be a signal. Her pulses were shown to be natural within weeks. Imre's test takes eleven wakings a turn and may never settle.
links: [MYST-0009, PHYS-0002, SOC-0013, POL-0006, PLACE-0001, TECH-0007, SOC-0012]
```

```yaml
id: CHAR-0004
title: Halde
status: established
plausibility: n/a
summary: Throat-wright, about 330, who has tended the gate since she was an apprentice; she turned the wheel that let the retraction through 304 years ago. She has died and been remade four times and has never missed a refusal test. She asked the Narrator to witness the latest test because it carries what it sees to no rail.
rules_and_limits: She holds no key and cannot open or seal the throat. She will not speak of the gate's working outside the craft, and she has shown no rail her own position. She is remakeable, so the craft's knowledge does not depend on her surviving, but its silence depends on her keeping it.
consequences: Craft: as the oldest wright she decides who may witness a test and who inherits custody of the gate. Politics: she alone knows how many wrights would break the silence if she did, so her silence works as a quiet check beside the nine keys.
story_conflict: Halde wants the gate kept out of the argument. Sef, her apprentice, wants the region told, and the region cannot be told without someone losing custody of the gate, him or her.
nearest_precedent: Stanislav Petrov, who in 1983 judged a missile warning false and reported it as false. Petrov spoke. Halde knows the region's main argument is empty and says nothing.
links: [ORG-0002, TECH-0008, SOC-0014, CHAR-0001, HIST-0003, TECH-0006]
```

## Technology

Eight technologies carry the plot: the road, the keys, the Correction, remaking, the Gloss, the rule that decides what the road will install, the bowls that decide what a house can hear, and the test that shows the gate refusing.

```yaml
id: TECH-0001
title: The Solward Road (relay tree)
status: established
plausibility: needs-breakthrough
summary: Standard-authority traffic moves down a tree of tight-beam relays rooted at Sol, laid in order of settlement. Each system accepts such traffic only from its single solward parent and transmits only to its children. Each relay adds its own mark, so a message's authenticity is its chain of custody.
rules_and_limits: The road is outward-only, and no relay has an inward beam. Inward news crosses only by weak sideways signals or ships, is rare, and carries no marks. A message arriving sideways has no standing. Any relay can therefore silence its whole outward subtree. Marks prove the path, not the sender's sincerity or survival.
consequences: Power concentrates at trunk relays, which become the nearest thing to seats of government. An anti-forgery design became the reason no one can route around a hold. No region ever hears from the places it relays to, so whether anyone lives outward is unknowable (MYST-0008), and Sol judged the Standard's harm from its near neighbours alone.
story_conflict: Someone who wants the retraction released could carry it sideways or by ship, but it would arrive unmarked and decades late, to people with every reason to call it forged.
nearest_precedent: Internet certificate chains and the telegraph relay station. Ours cannot be re-rooted, runs in one direction only, and each hop costs years rather than milliseconds.
links: [PREM-0001, HIST-0002, HIST-0004, ORG-0001, SOC-0008, MYST-0008, MYST-0001, TECH-0006]
```

```yaml
id: TECH-0002
title: Unclonable Keys
status: established
plausibility: needs-breakthrough
summary: Each keeper's key is a physical state that cannot be copied or inspected without destroying it. It can be transferred whole to one recipient. It is carried in the keeper's body and does not survive reconstruction of the keeper.
rules_and_limits: No backups, no duplicates, no escrow. A key lost with its keeper is gone. The no-copying rule is known physics, but holding such a state stable for centuries inside a body is not.
consequences: Remaking cannot restore a keeper to office, so keepers are among the few people in read houses for whom death is final in practice. A design meant to stop forged authority made the relay hostage to nine individual lives.
story_conflict: A keeper's kin may want them remade after death. The rails want the key handed on before it, and the two timings do not always agree.
nearest_precedent: Stephen Wiesner's quantum money. That scheme protects value from counterfeiting. Ours protects authority, and makes it mortal.
links: [ORG-0001, TECH-0001, PREM-0003, MYST-0004, TECH-0004]
```

```yaml
id: TECH-0003
title: The Correction
status: established
plausibility: speculative
summary: The Standard's local enforcement. Each habitat reads every resident mind during a shared sleep, compares it with the template, and smooths whatever the template cannot express. The person wakes without the thought and without any sense of injury.
rules_and_limits: It leaves alone any opinion, memory, or feeling that can be stated within the Standard. It cannot alter physical records, only minds. It works per habitat, not per person. It is the largest single source of waste heat in a settled place, and a night's cost rises with how much it smooths.
consequences: All four kinds of mind keep one sleep cycle, so time is counted in wakings. The heat it sheds supports whole trades and ecologies, so switching it off would also end livelihoods. Its readings are what remaking is built from (TECH-0004). Because smoothing is costly, the most divergent residents are the most expensive to keep (SOC-0011).
story_conflict: Someone who wants to keep a new thought must stay awake, leave, or write it down for a self who will not understand it. Their household wants them rested and recognisable.
nearest_precedent: Newspeak in George Orwell, Nineteen Eighty-Four. Newspeak narrows language to prevent dissent. The Correction leaves dissent intact and removes only what cannot be shared.
links: [HIST-0002, MIND-0002, SOC-0003, PLACE-0001, TECH-0004, TECH-0005, SOC-0011]
```

```yaml
id: TECH-0004
title: Remaking
status: established
plausibility: speculative
summary: Read houses keep each resident's most recent nightly reading. When a resident dies, the house builds a new body or substrate and instantiates that reading. The remade wake with nothing after the reading, which is usually one day.
rules_and_limits: Remaking works only from a reading, and Unread Houses take none. It cannot recover anything after the last reading. It cannot restore an unclonable key. A house can remake only a few people a night (two in Vane's house), fixed by how much heat it can shed. A dead person's reading can be held only a few nights before the heat of holding it must be shed, and then it is lost. When deaths exceed capacity, the Remaking Order decides (POL-0004), so mass deaths stay real.
consequences: Physical risk is cheap in read houses, so dangerous trades like east-face scraping are casual work. Obeying the retraction ends remaking for that house, so leaving the Standard means becoming mortal.
story_conflict: The remade want their lives back whole. Those who hold remaking makes a new person want the dead mourned and not replaced, and they share households with the replacements.
nearest_precedent: Richard K. Morgan, Altered Carbon (cortical stacks). There the backup is a person's own record. Here it is made by the machine that edits you nightly, so what returns is the self the Standard approved.
links: [TECH-0003, PREM-0003, TECH-0002, PLACE-0001, POL-0002, MYST-0006, POL-0004, SOC-0011]
```

```yaml
id: TECH-0005
title: The Gloss
status: established
plausibility: speculative
summary: A variant of the Correction that reads each mind nightly but does not smooth. Where it finds something the Standard cannot express, it leaves it and adds the nearest Standard rendering beside it. The person wakes with both, and others share in the gloss through their own readings.
rules_and_limits: It is built entirely from the Standard's own parts, so it is a rearrangement, consistent with SOC-0009. A gloss is lossy and states only what translates. It still takes readings, so it allows remaking. Its long-term effect is unknown, because the only trial is forty years old.
consequences: It promises Unity's whole programme at once: legibility across the disc, remaking, and drift preserved. Early signs suggest children glossed from birth prefer the gloss line over their own, which may make it the old Standard reached by a longer road.
story_conflict: Unity adherents want it sent outward now, to end smoothing without ending kinship. Divergence says a mind that always has a shared version beside it will learn to think only in the shared version.
nearest_precedent: The Babel fish in Douglas Adams, The Hitchhiker's Guide to the Galaxy. The Babel fish translates between speakers. The Gloss translates each mind to itself, and the translation may become the person.
links: [TECH-0003, TECH-0004, SOC-0009, PREM-0004, POL-0003, PLACE-0002, MYST-0007]
```

```yaml
id: TECH-0006
title: The Admission Rule
status: established
plausibility: speculative
summary: The channel the Standard rides accepts a self-executing install from a system's parent only if the install keeps the Standard's shared layer of mind intact. An install that would dismantle the Standard is refused, whoever sends it, Sol included. The throat-wrights (ORG-0002) know the rule as the working rule of the gate they keep and test it every thousand wakings (TECH-0008); almost no one else in the region does.
rules_and_limits: It applies only to installs with teeth. Messages that merely ask, like the retraction, pass freely and bind no one. No relay can disable the rule, because it is part of what each relay enforces. A gate that cannot judge refuses every install, so decay cannot open it. Whether a Gloss install would also force its own relay onward past a child system's keepers is not fixed in canon.
consequences: The retraction had to ask, because nothing else could have passed. Its toothlessness therefore proves nothing about who sent it. The Gloss keeps the shared layer, so any relay could install it outward with full force. Release and the Gloss look like matching acts at the throat, since both need nine keys, but they are not: the Gloss would install in every child system it reached, while the retraction would be one more request that each child's keepers could hold, as these have.
story_conflict: Sol's makers built the Standard so no one could undo it by order, and their successors found that this included themselves. In the present, release can only ask, while the Gloss can compel, which tilts the throat toward the gentler mistake. The few who know this keep quiet (SOC-0014).
nearest_precedent: Entrenched clauses in constitutions, which cannot be amended away. Those protect rights from a later majority. Ours protects an error from its own authors.
links: [HIST-0002, HIST-0003, MYST-0001, TECH-0001, TECH-0005, POL-0003, ORG-0002, TECH-0008, SOC-0014, MYST-0011]
```

```yaml
id: TECH-0007
title: Listening Bowls
status: established
plausibility: speculative
summary: Every habitat has a listening bowl that gathers faint signals from the sky: far-works, sideways signals, and anything else that falls on the region. In read houses its output passes through a filter built from the Standard, which drops anything that has no meaning to a read mind before anyone hears it. The Unread Houses removed the filter when they switched off the Correction.
rules_and_limits: The bowl itself is ordinary known physics; only the filter is speculative. The filter removes nothing from the sky: the raw signal still reaches the bowl, and a read mind hearing it unfiltered hears only hiss. It cannot be tuned, because it judges by the template, not by band or source. Removing it from a read house is possible and pointless, since the residents cannot understand what it lets through.
consequences: Perception: read houses have never heard the Hum, and they would not hear an unmarked sideways message in a drifted form either, which bears on any news from another branch of the road. Authority: Unread listeners become the region's only ears for anything new, a second unauditable authority beside the comb-readers (SOC-0010).
story_conflict: Read households who want to know what the Unread are hearing must trust an Unread report. Unread listeners who want to be believed cannot show a read mind the thing itself.
nearest_precedent: Spam filters and audio noise gates, which drop signals judged worthless. Those judge by rules their users can read. Ours judges by a mind its users share and cannot inspect.
links: [MYST-0009, TECH-0003, SOC-0008, SOC-0010, HIST-0002, PLACE-0001, CHAR-0003]
```

```yaml
id: TECH-0008
title: The Refusal Test
status: established
plausibility: speculative
summary: Every thousand wakings the throat-wrights feed a sealed pattern called the blind into the gate from its solward side, as if the parent had sent it, and the gate refuses it with a single low note. The blind, and the instruction to test with it, came from solward with the Standard. A wright cuts one stroke on the gate's housing for each refusal, and no stroke has ever been missed.
rules_and_limits: The test shows that the gate refuses the blind; it shows nothing about what the blind is (MYST-0011). A gate that cannot judge refuses everything, so the test cannot let the blind through by failing. The blind can be fed only to the gate, and no other door into a house's Correction is known. Nothing in the test needs a key, and nothing passes outward.
consequences: Evidence: the strokes on the housing are the only physical record in the region that the gate refuses some installs, and read minds can see them but cannot interpret them without the craft. Ritual: for 160,000 years a keeper witnessed each test; since the Hold keepers come with walkers, who carry what they see to their rail, so the craft has begun asking witnesses who hold no rail, like the Narrator.
story_conflict: A wright who wants the region told could bring a rail's witness to a test, but the note proves only that something was refused, and only the craft can say what. Halde wants the test kept as it always was, and every new witness she admits is a risk.
nearest_precedent: The EICAR test file, a harmless string that every antivirus program must flag. EICAR is known to be harmless. The craft says the blind is a working undoing, and nobody has opened it.
links: [TECH-0006, ORG-0002, MYST-0011, CHAR-0001, CHAR-0004, ORG-0001, SOC-0002]
```

### Physics

```yaml
id: PHYS-0001
title: Slow Minds in the Cold
status: established
plausibility: known-physics
summary: Far from a star, power is scarce, but the minimum energy cost of erasing a bit falls with temperature (the Landauer limit). A mind in the cold of a system's outer comet cloud can run for an immense time on little energy if it thinks slowly. Such a mind could be light-hours from a habitat and still years from a single exchange.
rules_and_limits: Slowness is the price of cheap, long thought; a cold mind cannot speed up without warming and spending power it does not have. Its signals are faint. This entry does not say such minds exist in the region.
consequences: Causal proximity (PREM-0002) is set by rate of thought as well as distance, so something near can be unreachable in any useful time. Anything that wanted to outlast the Standard without being read had a physical place to go.
story_conflict: Someone who wants to talk to a slow mind must commit generations to one conversation. Their household wants them in the present.
nearest_precedent: Freeman Dyson's 1979 proposal of minds that slow down to survive a cooling universe. Dyson's minds slow down to outlast the cosmos. Ours would slow down to outlast a neighbour's law.
links: [PREM-0001, PREM-0002, MYST-0009, MYST-0003]
```

```yaml
id: PHYS-0002
title: The Eleven-Waking Lag
status: established
plausibility: known-physics
summary: Light from the region's houses takes time to reach the cold and come back, so any response to their heat arrives late by at least the round trip. The Hum's swells follow the region's hot nights by eleven wakings, which puts its source no farther than about five and a half light-days if it answers at once. A thick cloud of dust warmed by the houses would also return their heat late, spread over the time light takes to cross the cloud, which turns one sharp night into a slow swell.
rules_and_limits: The lag gives an upper bound on distance, not a distance, because an unknown response time is folded into it. Neither a mind nor dust can be ruled out from loudness alone. A deliberate pattern (SOC-0013) is the only test: dust returns every pattern smeared in the same way, while a mind need not. The length of a waking in Sol-frame hours is not fixed in canon.
consequences: Knowledge: research as an institution does not exist in the read houses, whose craft produces no new kinds of thing (SOC-0009), so the region's first deliberate experiment in living memory was made by one Unread listener with a strip and a bowl. Proximity: a source within light-days is causally near (PREM-0002), so an exchange of reflexes fits inside a lifetime even if an exchange of slow thought (PHYS-0001) does not.
story_conflict: Those who want the Hum to be dust, because a cloud asks nothing of anyone, and those who want it to be a mind read the same matched strips. Only the reply to a deliberate pattern can separate them, and it may not.
nearest_precedent: The light echo around the star V838 Monocerotis after its 2002 outburst, in which a flash lit surrounding dust for years. That echo returned the flash's shape and was understood at once. Ours returns only quantity, and the people measuring it cannot tell whether the cloud is thinking.
links: [MYST-0009, PHYS-0001, SOC-0013, TECH-0007, PREM-0002, CHAR-0003]
```

## Institutions and politics

Nine keepers hold one relay, three rails fight over it, and one law decides who a person is after death. One craft keeps the gate and will not say what it knows.

```yaml
id: ORG-0001
title: The Keepers
status: established
plausibility: n/a
summary: The Narrator's relay transmits only when all nine keepers agree. Each holds an unclonable key handed down in a line going back to the Standard's arrival. The office was a maintenance duty for 160,000 years and became a moral one 304 years ago.
rules_and_limits: Unanimity is required for any transmission with standing, whether Sol's retraction or the Gloss. One refusal sustains the Hold. A keeper need not declare a position or justify a choice of heir. A key that dies with its keeper leaves eight, and eight cannot open the relay. Keepers have always slept in read houses and been corrected nightly; since Orrin's Handing one of the nine, Ione, sleeps glossed (POL-0005).
consequences: Succession is the region's most contested act, since naming an heir is the only vote that outlives the voter. Ordinary people can affect the outcome only through pressure on nine individuals and on the candidates presented to them. The keepers' names are cut on the throat wall, nine lines back to the first nine, the one part of that wall read minds can read.
story_conflict: A keeper who would release needs every holdout to change or be succeeded. A holdout needs only one like-minded heir, or one death.
nearest_precedent: The two-person rule for nuclear launch. That rule exists to prevent an act. Ours blocks an act that may itself be a rescue.
links: [HIST-0004, TECH-0001, TECH-0002, SOC-0001, SOC-0002, POL-0003, HIST-0006, POL-0005, CHAR-0002, MYST-0010]
```

```yaml
id: ORG-0002
title: The Throat-wrights
status: established
plausibility: n/a
summary: A small craft of read-house residents who keep the relay's machinery: the emitter, the press that adds the relay's mark, and the gate that decides what the road may install in the region. The craft is older than the Hold and passes by custody, not by Handing. Its members know the Admission Rule (TECH-0006) as a working rule of the gate, and almost none of them say so.
rules_and_limits: Wrights hold no keys and cannot open or seal the throat. They cannot change the gate's rule, only keep the gate sound. Their knowledge can be stated within the Standard, so the Correction leaves it alone, and because they are remade like anyone, the same few people have held the craft for centuries. Fewer than forty wrights live in the throat house.
consequences: Work: the 2026 engineer did not survive the change, because nothing is paid; keeping the throat is custody (SOC-0012), and tending its faces earns heat credit like any other tending. Knowledge: the region's only accurate understanding of what the road can compel sits with people bound not to share it (SOC-0014). Politics: a wright has no vote at the throat, but a rail that learned what the wrights know would gain more than any Handing could give it.
story_conflict: Every rail would want the wrights' knowledge if it knew they had any. The wrights want the gate kept out of the argument, because once a rail learns the gate decides what can be forced, the gate itself becomes a prize.
nearest_precedent: The stonemasons' guilds of medieval Europe, which kept their methods inside the craft. The masons guarded a livelihood. The wrights guard a fact that would decide the region's one political question.
links: [TECH-0006, TECH-0008, SOC-0014, CHAR-0004, ORG-0001, TECH-0001, SOC-0012, MYST-0001, MYST-0011]
```

```yaml
id: POL-0001
title: The Rails
status: established
plausibility: n/a
summary: Public life in the region is sorted by where a person stands at the relay. The release rail wants Sol's retraction sent; the hold rail wants nothing sent; the third rail wants the Gloss sent (POL-0003). Each rail is a coalition of incompatible reasons.
rules_and_limits: The rails are positions on one act, not governments or creeds. None can compel a keeper. Each would split the day its act was done.
consequences: Kinship, fostering, and trade in favours follow rail lines, so a change of rail costs a person their household. Each rail must suppress its internal disagreement, which makes all of them dishonest about why they stand where they do.
story_conflict: Within the hold rail, doubters want proof sought and Unity adherents want the Gloss. Any real evidence about authenticity would turn allies into enemies.
nearest_precedent: The Blues and Greens of Byzantium. Those factions fought over everything in turn. Ours exist for one irreversible act and have no programme beyond it.
links: [PREM-0004, HIST-0004, MYST-0001, ORG-0001, POL-0003]
```

```yaml
id: POL-0002
title: The Rule of the Last Reading
status: established
plausibility: n/a
summary: The Standard's continuity law. The newest existing reading of a person is that person, and whoever is remade from it inherits all their standing, debts, and bonds. An older reading held by another house gains standing if no newer one exists.
rules_and_limits: It forbids remaking a living person or remaking twice from one reading. A person may refuse their own remaking only by lodging the refusal in person with the house that holds their reading. Children cannot lodge refusals. No procedure exists to erase a reading or to refuse on someone else's behalf. It settles the law, not the truth of PREM-0003.
consequences: Anyone who leaves a read house leaves an old self behind that has legal standing, so read-house kin hold power over an Unread relative's death. Estates seldom pass on, so custody of unique things stays with the long-lived and the young inherit little.
story_conflict: A read-house parent can lawfully wake a decades-old version of a child who died in an Unread House. The child's later wishes, written anywhere but lodged in person, have no standing.
nearest_precedent: Roman postliminium, which restored a returning captive's rights. Postliminium restores the man who returns. Ours restores an earlier man and calls him the same.
links: [TECH-0004, PREM-0003, MIND-0002, PLACE-0001, SOC-0005, PLACE-0002]
```

```yaml
id: POL-0003
title: The Third Rail
status: established
plausibility: n/a
summary: The Glossmakers propose that the throat send neither silence nor Sol's retraction but the Gloss, installed outward with the relay's own marks. They draw mostly from the hold rail's Unity wing, with some release-rail members who want smoothing stopped and children kept remakeable.
rules_and_limits: Sending the Gloss needs all nine keys, the same as release. The region has one trial house and forty years of evidence. Once sent, the Gloss could not be recalled, exactly like the Standard.
consequences: The hold rail splits between doubters, who want nothing sent, and Unity, who want the Gloss sent. The release rail loses members who fear mortality more than glossing. Keeper succession now has three possible outcomes, and every candidate can be suspected of a third loyalty.
story_conflict: The Glossmakers need the Hold to last until a keeper turns to them. The release rail needs it to end now with Sol's message, and both need the same nine people.
nearest_precedent: Reformist movements offering a middle path between abolition and the status quo, such as gradual-emancipation schemes. Those delay a known cure. Ours offers a cure whose side effects will appear only after it is irreversible.
links: [POL-0001, ORG-0001, SOC-0001, TECH-0005, TECH-0006, PREM-0004]
```

```yaml
id: POL-0004
title: The Remaking Order
status: established
plausibility: n/a
summary: When more residents die than a house can remake in a night, it remakes them in order of heat credit (SOC-0011). A dead person's reading is held only a few nights, so whoever falls too far down the order dies for good. Pledges of credit are the only way to change the order.
rules_and_limits: Capacity is fixed by the house's radiating surface. Every pledge that lifts one person lowers another; there is no pledge that only lifts. Keepers and people who have lodged refusals are outside the order.
consequences: Accidents become contests of standing, and households hoard credit as insurance against them. The young, the newly arrived, and the inventive come last, so the order quietly favours long, conforming lives. The hold rail can say Unread Houses have no order because they remake no one; the release rail can say the read order prices people by how much they conform.
story_conflict: A parent working the faces without sleep to lift a dead child is opposed by neighbours whose own safety depends on keeping their credit, and helped only by those who have nothing to lose.
nearest_precedent: Triage in a mass-casualty event. Triage ranks by medical need and chance of survival. Ours ranks by a ledger the house keeps, which records years of conformity.
links: [TECH-0004, SOC-0011, POL-0002, SOC-0005, PLACE-0001]
```

```yaml
id: POL-0005
title: The Keeper's Sleep
status: established
plausibility: n/a
summary: Whether a keeper should sleep under the Correction became a public question with Orrin's Handing. A keeper cannot be remade in office, so leaving the read houses costs a keeper nothing in remaking, the one cost that keeps most people home. One keeper of nine now sleeps glossed; the other eight sleep read, as keepers always have.
rules_and_limits: No law says where a keeper sleeps, and none can be made, because nothing governs keepers. A keeper who leaves forfeits heat credit (SOC-0011) and takes their walkers into a colder, poorer house; in an Unread House the walkers would also become mortal. An unsmoothed keeper drifts, so over decades they may grow hard for the other eight, and for their walkers, to follow.
consequences: Politics: every rail must now say whether it wants its keepers corrected, and each answer embarrasses it; the hold rail cannot defend the Correction's grip on a vote without conceding the vote is shaped. Kinship: a keeper who moves loses the household that fostered them. Child-rearing: candidates may now be raised in the Glossed or Unread Houses, so where a child sleeps becomes part of the contest over the key.
story_conflict: The release rail wants keepers out of the Correction and hopes drift leans its way. The hold rail says a keeper who drifts holds the key for someone none of us will know. Both are guessing what an unsmoothed mind will do.
nearest_precedent: Jury sequestration, which keeps outside influence away from a verdict. Sequestration removes the world from the juror. Here the influence in question is the house the juror sleeps in.
links: [ORG-0001, TECH-0002, TECH-0003, TECH-0005, PLACE-0001, PLACE-0002, SOC-0002, SOC-0011, HIST-0006, MYST-0010]
```

```yaml
id: POL-0006
title: The First Voice
status: established
plausibility: n/a
summary: Nothing in the region governs who may speak to the cold. The throat confers standing on the road, but heat and the bowls belong to no one, so any house may say whatever it can afford. By shuttering without asking any rail, the far-limb house made itself the region's first voice to the Hum.
rules_and_limits: No rail can stop a house from shuttering, because nothing governs a house but itself. A shuttered message carries no marks and no standing and binds no one. The keepers' unanimity does not apply, since nothing passes through the throat.
consequences: Politics: the rails were built around one act at the throat and now face an act with no throat and no veto. The hold rail calls it a sending without keys; the release rail, which wants sending, cannot object without contradicting itself; the Glossmakers want any future speech glossed so read houses can follow it. Kinship: read families with kin on the far limb, Vane among them, are blamed by their rails for what the far house says.
story_conflict: Imre wants to speak to the cold as herself. Each rail wants the voice to say what it would say, and none can take the voice except by out-shuttering the far house, which costs a read house places on the Remaking Order.
nearest_precedent: The 1974 Arecibo message, sent without any agreement on who should speak for humanity. That message was a broadcast to no one in particular. Ours answers something that may already be counting us.
links: [MYST-0009, SOC-0013, POL-0001, POL-0003, POL-0004, ORG-0001, TECH-0001, CHAR-0003]
```

## Society

Fourteen customs show how ordinary people live with the keys, the Correction, remaking, heat, the far exchange, speaking to the cold, and the throat's silence.

```yaml
id: SOC-0001
title: The Handing
status: established
plausibility: n/a
summary: A keeper nearing the end names one heir from candidates presented by others and transfers the key. Because a candidate with a known position is always opposed by one rail, the rails raise children to show no position at all. The result is heirs whose convictions are unknown even to those who raised them.
rules_and_limits: The keeper chooses alone and owes no explanation. No one can verify a candidate's mind. The Standard makes people intelligible, not transparent. A Handing changes one position out of nine and by itself opens nothing.
consequences: A class of people is raised from infancy for an office most will never hold, which leaves the region with adults trained to conceal themselves and nothing to do. Child-rearing becomes political strategy, and households compete to foster candidates.
story_conflict: The rail that raised a candidate wants loyalty. The candidate, taught to show nothing, may have none, or may have their own.
nearest_precedent: Adoptive succession among the Roman emperors. Those heirs were chosen for visible merit and inherited rule. Ours are chosen for opacity and inherit a veto.
links: [ORG-0001, TECH-0002, POL-0001, MIND-0002, POL-0003]
```

```yaml
id: SOC-0002
title: The Walkers
status: established
plausibility: n/a
summary: Because a keeper's death without a Handing would seal the Hold permanently, the release rail guards every keeper, including the holdouts it most opposes. Walkers taste a keeper's food, accompany them, and sleep at their door. The threat they guard against comes from hold extremists willing to kill any keeper to end the question.
rules_and_limits: Walkers protect and may not coerce. A walker who harmed a keeper would destroy their own cause. They cannot protect a keeper from choosing to end without handing on.
consequences: Holdout keepers live in daily intimacy with people who despise their choice, which wears on both and sometimes changes one of them. The hold rail must police its own extremists or be blamed for a sealing most of its members do not want.
story_conflict: A walker wants the keeper alive and persuaded. A hold extremist wants any keeper dead. The keeper wants to be left alone with a decision nobody will let them make alone.
nearest_precedent: A state bodyguard protecting a leader they voted against. There the duty is professional. Here it is strategic, because the opponent's death is the one outcome the guard cannot survive politically.
links: [ORG-0001, TECH-0002, POL-0001]
```

```yaml
id: SOC-0003
title: Night-strips
status: established
plausibility: n/a
summary: Many residents write down a thought before sleep. If the thought lay outside the Standard, the writer wakes to find their own handwriting unintelligible. Households keep these strips in boxes, sometimes for generations.
rules_and_limits: A strip preserves the words, not the understanding. No Standard-made reader can recover the meaning, including the author. Most strips are ordinary and remain readable. Only the smoothed ones matter, and nobody can tell in advance which those will be. In the Glossed House strips carry a second line, the house's gloss.
consequences: The boxes are an archive of everything the region has thought and lost, which makes them irreplaceable history under PREM-0002. They are also the only evidence a resident has of how much the Correction takes from them personally.
story_conflict: Those who can read drifted language want the boxes opened to them. Families who have kept them unread for generations fear what they would learn about their own dead.
nearest_precedent: Christopher Nolan, Memento. There the notes guide a man who cannot remember. Here the note survives and the reader is the one who has been changed.
links: [TECH-0003, PREM-0002, MYST-0005, PLACE-0002]
```

```yaml
id: SOC-0004
title: The Telling
status: established
plausibility: n/a
summary: After a remaking, everyone who witnessed part of the lost day recounts it in order to the remade person. By law the remade accept that account as their own past.
rules_and_limits: Only witnessed hours can be told, and unwitnessed hours are lost for good. A telling can be mistaken or shaded, and the remade cannot check it.
consequences: People do risky work in company so their day can be told, which makes solitude a real cost. Guilt for acts on the lost day rests on witnesses, so the remade answer for deeds they cannot remember.
story_conflict: A remade person accused of something done on the lost day must take the witnesses' account as memory. The witnesses may want them guilty.
nearest_precedent: The funeral eulogy. A eulogy is told about the dead to the living. The Telling is told to the returned dead, who must take it as their own.
links: [TECH-0004, POL-0002]
```

```yaml
id: SOC-0005
title: The Mourners
status: established
plausibility: n/a
summary: A minority lineage, older than the Standard, holds that every remaking ends one person and begins another. The belief survives the Correction because it can be stated. Mourners grieve every remaking, and many lodge refusals so that they will die once.
rules_and_limits: A refusal binds only the refuser. A Mourner married to a remade person stays married by law to someone they believe is a stranger.
consequences: For Mourners, the only sure way to die once is to move to an Unread House, which makes continuity belief a driver of retraction-obedience. This allies Mourners with the release rail and makes Unity adherents read them as choosing death.
story_conflict: A Mourner wants to die once. Their household wants them back every time, and pressures them not to lodge a refusal.
nearest_precedent: Religious refusal of life-saving treatment, such as blood transfusion. That refusal turns down a cure. Ours turns down a continuation the household calls the same person.
links: [PREM-0003, POL-0002, PLACE-0001, POL-0001, PREM-0004]
```

```yaml
id: SOC-0006
title: The First Word
status: established
plausibility: speculative
summary: Every child shaped by the reading says the same first word, the word for the one who answers when called. Nobody teaches it. It persists because the reading leaves it untouched while smoothing what grows around it.
rules_and_limits: It indicates that a mind was shaped. It does not show what was smoothed. Converts said it as children, so it marks origin and not present allegiance. Unread-born children do not say it.
consequences: It has become an informal sign of kinship, and of being one people across the disc, which matters most to Unity. It is also the cheapest way to tell an Unread-born stranger from a read one, so it can be used to exclude.
story_conflict: Hold extremists say anyone who never spoke the First Word is no kin of theirs. Unread parents hear in that a claim that their children are not people.
nearest_precedent: "Mama" and "papa" recurring across real languages. Those arise from how infants form sounds. Ours is imposed by a template, and it marks who was shaped.
links: [MIND-0002, MIND-0003, PREM-0004, MIND-0001]
```

```yaml
id: SOC-0007
title: Waking Visits
status: established
plausibility: n/a
summary: Read and Unread houses can visit each other freely, but no one sleeps across the line. A read visitor who sleeps in an Unread House goes unread for a night. An Unread visitor who sleeps in a read house is smoothed. Every visit ends before sleep. The Glossed House is the one exception.
rules_and_limits: A read person can stay unread for longer, but every night away drifts them a little further from their household. Staying awake extends a visit only at great physical cost. One night in a read house undoes everything an Unread person grew.
consequences: Families split across the line meet only in short daylight visits, so distance in hours becomes distance in kinship. People who can stay sleepless for long stretches become carriers, the only ones able to bring an Unread thought into a read house intact for a while.
story_conflict: A grandparent wants a grandchild to stay the night. The child's parent knows one night would take the child away from himself.
nearest_precedent: Persephone and the pomegranate. Eating in the underworld binds Persephone to return. Sleeping in the wrong house does not bind you; it erases you.
links: [PLACE-0001, TECH-0003, MIND-0003, SOC-0003, PLACE-0002]
```

```yaml
id: SOC-0008
title: Far-works
status: established
plausibility: known-physics
summary: Works made to be sent outward as patterns and rebuilt by Standard-made receivers thousands of years later. Because sender and receiver share a template, a far-work is understood exactly as meant, jokes included. Works from solward arrive the same way, made by people long dead or changed.
rules_and_limits: They travel by an ordinary beam, which needs no keys and carries no authority. Makers never learn whether a work arrived or whether anyone was there to receive it. Only Standard-made receivers can be counted on to read them as meant.
consequences: Release would end this exchange outward within a few generations of each place obeying, which gives the hold side a cultural loss to point to and not only mortality. Makers who want their work read have a personal interest in sending before release, so the timing of the Hold reaches into every workshop.
story_conflict: A maker wants the Hold to last until their work is sent. A release-rail kinsperson wants it ended now, and every far-work in progress is a reason someone asks for one more year.
nearest_precedent: The Voyager Golden Record. The Record is addressed to strangers who may not share anything with us. Far-works are addressed to strangers guaranteed to share everything, and that guarantee is what the retraction would end.
links: [HIST-0002, TECH-0001, HIST-0004, PREM-0004, SOC-0009]
```

```yaml
id: SOC-0009
title: Template Craft
status: established
plausibility: speculative
summary: The read houses make a great many new works and no new kinds of thing. Novelty is arrangement: new combinations, refinements, and subjects within categories the Standard already holds. Mastery means doing an inherited form more exactly and more personally than anyone before.
rules_and_limits: A new category of work, tool, or idea would be smoothed overnight, often from the mind that invented it (SOC-0003). Arrangement is unlimited, so read culture is neither frozen nor empty. The Gloss shows arrangement can still produce something with consequences.
consequences: Read culture is deep, legible across the disc, and worth defending, which keeps PREM-0004 balanced against MIND-0003. Tools and techniques have not changed in kind for 160,000 years, so any new technology in the region comes from the Unread Houses or from before the Standard (MYST-0003).
story_conflict: A read maker who keeps waking to unreadable night-strips about their own craft wants to know what they keep inventing. Their household and guild want the work that can be shared.
nearest_precedent: The Japanese tea ceremony, or any strict classical form. Those forms are chosen and can be left. Ours was imposed, cannot be left without leaving the house, and is the only shared language across the disc.
links: [TECH-0003, SOC-0003, SOC-0008, MIND-0003, PREM-0004, HIST-0002, TECH-0005]
```

```yaml
id: SOC-0010
title: Comb-readers
status: established
plausibility: speculative
summary: Some Unread-born adults can read parts of the comb, the Before writing on habitat walls, and each generation born unread reads more than the last. What they read is mostly lists: names, debts of heat, who slept where, and quarrels. No read mind can verify any of it.
rules_and_limits: Readings differ between readers, and no neutral party can compare them. A reader loses the ability after one night in a read house. A reading passed through the Gloss would be legible to everyone but lossy.
consequences: The release rail gains evidence that the Standard replaced a people with names, not a blank. Unread elders become the region's only historians, a new kind of authority that read houses cannot audit.
story_conflict: The Glossmakers want a reader to sleep one night glossed so the walls can be shared. Readers refuse, because the gloss would fix a lossy version as the official past.
nearest_precedent: Michael Ventris deciphering Linear B. His work could be checked by any trained scholar. Ours can be checked only by people who have stopped being one of us.
links: [PLACE-0003, MIND-0003, MYST-0005, TECH-0005, PLACE-0001, HIST-0005]
```

```yaml
id: SOC-0011
title: Heat-debt
status: established
plausibility: speculative
summary: Each read house can shed only so much waste heat a night, and every reading, remaking, and hour of thought spends it. The house keeps a ledger of what each resident adds to that capacity, by tending radiating faces, mats, and lichen, and what each costs to keep. A resident's balance is their heat credit or heat-debt.
rules_and_limits: Heat cannot be moved between habitats, so credit is local and is forfeited when a person leaves. The house writes the ledger, and no resident can edit it. Credit can be pledged to another but never created. Unread Houses run no Correction, have heat to spare, and keep no ledger.
consequences: Money mutated into this: an obligation that cannot travel, and banks are meaningless. Because smoothing costs heat, the minds that grow most cost most, so divergence is taxed every night without anyone deciding it. The ledger also sets the Remaking Order (POL-0004), which makes the economy a matter of life and death. Heat debts predate the Standard: the comb's lists record them (SOC-0010), so this is the region's oldest institution.
story_conflict: A maker whose work keeps drifting runs deep in debt. Their household wants them cheaper to keep, which means wanting them to stop making.
nearest_precedent: Wartime ration books. Rationing allocates a fixed resource by rule. Ours charges people for being different, and the charge falls hardest on the inventive.
links: [TECH-0003, TECH-0004, POL-0004, SOC-0010, PREM-0002, SOC-0009]
```

```yaml
id: SOC-0012
title: Custody
status: established
plausibility: n/a
summary: Unique things cannot be exchanged, because nothing equally unique can be given in return. Night-strip boxes, far-works, comb walls, keys, and the held readings of the dead are kept in custody instead. A custodian gains standing and owes access, and custody passes by naming an heir, not by sale.
rules_and_limits: Custody cannot be bought with heat. A custodian may refuse access, but loses standing if the refusal becomes known. Things too large to move, like walls, are held by the house as a whole, so no single person can protect them.
consequences: Status in the region is what you keep, not what you own. Because the house holds the comb collectively, nobody has standing to stop a repair that cuts through it (PLACE-0003). Because the house holds the readings of the dead, it holds power over every grieving family.
story_conflict: A custodian of a family box of night-strips wants it kept unread. A comb-reader wants access. Neither can buy the other out.
nearest_precedent: Annette Weiner's "inalienable possessions", objects kept out of exchange to anchor a lineage. Weiner's objects are withheld by choice. Ours cannot be exchanged at all.
links: [PREM-0002, SOC-0003, SOC-0008, PLACE-0003, TECH-0002, SOC-0001]
```

```yaml
id: SOC-0013
title: Shuttering
status: established
plausibility: known-physics
summary: A house speaks to the cold by closing and opening its radiating faces by hand, so that the heat it throws at the dark rises and falls in a chosen pattern. The far-limb Unread house did this first, at Imre's word, to give the Hum back its own swell. Every read house has always spoken this way without meaning to, because its nightly heat is mostly the cost of the Correction.
rules_and_limits: Closing faces means shedding less heat, so a read house that shutters loses remaking capacity for that night and charges its ledger (SOC-0011, POL-0004). Unread Houses keep no ledger and have heat to spare, so only they can speak freely. A pattern is slow: one shape takes a waking or more to send, and any answer takes at least eleven wakings.
consequences: Economy: the cheapest voice in the region belongs to the houses that remake no one, which reverses every other cost of leaving the Standard. Labour: shuttering needs many hands on the faces at once, so speaking to the cold is a whole house's act, not one person's. Meaning: if anything is listening, the read houses have told it every night for 160,000 years how much it costs to keep their people the same.
story_conflict: The far house wants to keep shuttering. A read house that wants its own say must buy it with a night of someone's remaking, and the residents on its order want the faces left open.
nearest_precedent: Signal fires and heliographs, which spoke with light. Those messages had readers who knew the code. Ours is sent to a reader no one has confirmed, in the one code it has been shown to notice.
links: [MYST-0009, PHYS-0002, SOC-0011, POL-0004, POL-0006, PLACE-0001, TECH-0003, CHAR-0003]
```

```yaml
id: SOC-0014
title: The Wright's Silence
status: established
plausibility: n/a
summary: A craft rule older than the Hold forbids wrights to speak of the gate's working outside the throat house, because knowing how the gate judges is the first thing a forger would need. Since the retraction came, the rule has kept from the region the two facts that would change the argument most: no one could have given the retraction teeth, and the Gloss could be installed outward with full force while release can only ask. Wrights keep the silence for opposite reasons.
rules_and_limits: The silence binds only wrights. A wright who breaks it loses custody of the gate, and the craft names another. Without the refusal test a wright's word is an unmarked claim with no more standing than anyone's, and the craft controls the test. The silence cannot stop anyone else from guessing.
consequences: Politics: release-leaning wrights keep quiet because the truth would tilt the throat toward the Gloss, and hold-leaning wrights because it empties the forgery argument, so the silence holds with no agreement on why. Belief: the region's leading argument about authenticity (MYST-0001) rests on an error the only people who could correct it will not. Kinship: a wright cannot explain to their household why they stand where they do, so wrights become strangers at home.
story_conflict: Sef, fostered by Glossmakers, wants to speak, because the truth serves the rail that raised him. Halde wants the gate kept out of the argument, and the craft can take the gate from him the moment he speaks.
nearest_precedent: The seal of the confessional, which binds a priest to keep what he hears. The priest protects a penitent. The wrights protect a machine, and their silence decides an argument they are not allowed to join.
links: [ORG-0002, TECH-0006, TECH-0008, TECH-0005, POL-0003, MYST-0001, SOC-0012, CHAR-0004]
```

## Places

Two kinds of house break from the read norm: the Unread Houses, which obeyed, and the single Glossed House, which tried a third way.

```yaml
id: PLACE-0001
title: The Unread Houses
status: established
plausibility: speculative
summary: A minority of habitats in the region obeyed the retraction and switched off the Correction, some nearly 300 years ago. Their residents sleep unread and have begun to drift. After nine generations their speech holds words the Standard-made cannot follow.
rules_and_limits: Moving to an Unread House is easy. Returning costs everything grown there, because one night in a read house smooths it. Unread Houses still understand the Standard-made, so the failure of understanding runs one way for now. They take no readings, so their residents cannot be remade and death there is final.
consequences: Families are split by a border that can be crossed freely in one direction only. The houses are living evidence in the Unity and Divergence argument. The hold rail can now argue that releasing the retraction makes every outward world mortal.
story_conflict: A parent in a read house wants a child back. The child would have to give up the person they have become in order to return.
nearest_precedent: The Amish Rumspringa. There the young leave, sample the outside, and may return whole. Here the leaving is permitted and the returning is what erases.
links: [HIST-0003, TECH-0003, MIND-0002, POL-0001, TECH-0004, POL-0002, SOC-0005, MIND-0003]
```

```yaml
id: PLACE-0002
title: The Glossed House
status: established
plausibility: speculative
summary: The single habitat in the region running the Gloss instead of the Correction, for forty years. It is colder and poorer, because it sheds less heat for its lichen trades. It is the only place where read and Unread people can sleep together and both wake unchanged in kind.
rules_and_limits: Anyone who sleeps there is read and becomes remakeable from that reading under POL-0002. Children cannot lodge refusals, so a child read there once can be remade by kin. Glossed strips carry two lines: the writer's and the house's.
consequences: Split families use it for the only overnight reunions available, which hands remaking power over Unread children to their read grandparents. Its children are the only data on the Gloss, so every rail watches them closely.
story_conflict: A read grandparent wants a grandchild kept remakeable. An Unread parent wants their child to die once, as the child's own.
nearest_precedent: The neutral zone in the Korean DMZ where separated families have met. Those reunions change no one. One night here changes a child's legal mortality.
links: [TECH-0005, POL-0002, SOC-0007, MIND-0003, SOC-0003]
```

```yaml
id: PLACE-0003
title: The Comb (Before walls)
status: established
plausibility: known-physics
summary: Every habitat in the region is built inside or from structures older than the Standard, and their inner walls carry dense rows of short cuts. Read minds perceive these only as ornament, called the comb. The Correction cannot alter physical records, so the comb has survived 160,000 years untouched and in plain sight.
rules_and_limits: Only minds outside the Standard can read it, and only partly. A copy is as unreadable to read minds as the original. Each wall exists once, and no full record of the comb has ever been made.
consequences: The region's largest store of irreplaceable history (PREM-0002) is the walls people sleep against. Heat repairs and expansions for remaking capacity routinely cut through comb nobody can read, so ordinary maintenance destroys history.
story_conflict: Unread readers want walls left untouched until read. Read houses need walls repaired and enlarged, and see no writing to protect.
nearest_precedent: The graffiti of Pompeii, ordinary notes preserved by accident. Pompeii's walls can be read by anyone who learns Latin. Ours can be read only by those who stop being corrected.
links: [PREM-0002, TECH-0003, SOC-0010, HIST-0005, MYST-0003, SOC-0003]
```

## Open mysteries

Eleven questions stay open on purpose. Canon must not answer them without a deliberate decision.

```yaml
id: MYST-0001
title: Is the Retraction Authentic?
status: open
plausibility: n/a
summary: In the region it is widely believed that only Sol could have given a retraction teeth, so its toothlessness is read as either repentance or forgery. In fact no one could have given it teeth (TECH-0006), so its form is no evidence at all. Only the marks remain, and the marks are 40,000 years old.
rules_and_limits: No evidence available in the region can settle it. A query to Sol cannot travel the outward-only road and would take 80,000 years by any other route.
consequences: Legal and religious positions rest on an argument that is factually wrong. The few who know the Admission Rule, the throat-wrights, keep quiet for opposite reasons (SOC-0014). Any upstream relay remains a suspect.
story_conflict: Believers and doubters read the same sentence and each sees proof. Whoever proves the toothlessness argument wrong damages both sides at once.
nearest_precedent: The Donation of Constantine. That forgery was exposed by scholarship. Here scholarship can only show that the question was never answerable.
links: [HIST-0003, TECH-0001, TECH-0006, ORG-0002, SOC-0014]
```

```yaml
id: MYST-0002
title: The Solward Silence
status: open
plausibility: n/a
summary: Nothing bearing Sol's marks has arrived since the retraction. Systems that obeyed would stop relaying Standard traffic, so silence fits obedience upstream. It fits collapse, a change of mind, or a hold somewhere upstream just as well.
rules_and_limits: The Narrator's region cannot distinguish these cases. Whatever Sol is now, the region will not learn it within any living span.
consequences: Unity reads the silence as abandonment and a reason to self-govern a new standard. Divergence reads it as Sol keeping its word.
story_conflict: One side wants to listen harder and wait. The other says waiting is itself the decision to hold.
nearest_precedent: The Fermi "Great Silence". There the silence concerns strangers. Here it concerns our own makers.
links: [HIST-0003, PREM-0001]
```

```yaml
id: MYST-0003
title: What Was Here Before
status: open
plausibility: n/a
summary: Records of the Before survive on every inner wall as the comb (PLACE-0003), readable only by Unread readers. Whether any mind of the Before survives is unknown. One late, hurried line, read by Pell, says that those who would not sleep for the Standard went out to the cold, to be slow and to wait. Pell's reading of the throat wall adds that the Before's own nine throat-keepers did sleep, and opened after.
rules_and_limits: No read mind can verify either reading. Neither says how many went, whether they survived, or whether they changed. Any survivors would not be the Before preserved: 160,000 years of slow, uncorrected drift would make them strangers.
consequences: Sites older than the Standard become the scarcest things in the region. If survivors exist, they are a living preview of where divergence ends, unique minds and strangers at once, and every rail would need that preview to mean something different. Read together, Pell's two readings suggest the Before split on the first night: some went to the cold rather than sleep, and those who held the throat stayed and were corrected.
story_conflict: Those who search for the Before want it found. Those invested in the Standard-made being the region's rightful people want it to stay lost.
nearest_precedent: Gene Wolfe, The Fifth Head of Cerberus. Wolfe asks whether the natives replaced the colonists. We ask whether the replaced left anything the replacers can still see.
links: [HIST-0001, HIST-0002, HIST-0005, MIND-0002, PREM-0002, SOC-0009, PLACE-0003, SOC-0010, PHYS-0001, MYST-0009, HIST-0006, MYST-0010]
```

```yaml
id: MYST-0004
title: Can a Relay Be Re-keyed?
status: open
plausibility: n/a
summary: No one in the region knows whether a lost key can be replaced or a relay rebuilt with standing on the Solward Road. No key has been lost here in 160,000 years. Any procedure would have come from solward, and solward is silent.
rules_and_limits: The region cannot test the question without losing a key. Downstream systems accept only their parent's marks, so a new relay with new keys may simply not be believed.
consequences: Every rail acts on a belief none can check, and the belief that loss is permanent is what keeps the keepers alive. If someone showed re-keying was possible, the walkers' restraint would lose its reason.
story_conflict: Researchers who want to find a re-keying method are opposed by everyone who fears what the rails would do to the keepers once they were replaceable.
nearest_precedent: A lost private key to a cryptocurrency wallet. That loss locks up wealth. Ours would lock a message out of an unknown number of worlds.
links: [TECH-0002, TECH-0001, MYST-0002]
```

```yaml
id: MYST-0005
title: Is Drift Meaning or Noise?
status: open
plausibility: n/a
summary: Nobody can say whether what the Correction removes, and what the Unread Houses are growing, is new thought or mere divergence without content. The Standard-made cannot judge what they cannot understand. The Unread say they can read some old night-strips, and no read person can check the claim.
rules_and_limits: Any judge is on one side of the line or the other. No neutral reader exists in the region; the 2026 visitor is a frame, not a reader.
consequences: The moral weight of the Hold depends on the answer, because the outward minds being corrected are either being robbed or being kept sane. The value of every box of strips depends on it too.
story_conflict: The Unread want their drift recognised as thought. Unity adherents need it to be noise, or the gentler standard they propose is also a theft.
nearest_precedent: Stanisław Lem, His Master's Voice. Lem's scientists cannot decide whether a signal from the stars means anything. Our undecidable signal is our own children.
links: [TECH-0003, SOC-0003, PLACE-0001, PREM-0004]
```

```yaml
id: MYST-0006
title: What the Reading Keeps
status: open
plausibility: n/a
summary: A house must read a mind before it can smooth it, so for a moment it holds what the Correction removes. Nobody knows whether the stored reading is taken before or after smoothing, or whether anything smoothed is kept anywhere. The remade never recall smoothed thoughts, which suggests the reading is taken afterward but proves nothing.
rules_and_limits: The houses do not explain their own working, and the procedure came from solward. A Standard-made mind could not understand a smoothed thought even if it found one.
consequences: If pre-smoothing readings survive, every read house holds an archive of everything the region has lost. In that case the Unread readers of MYST-0005 would be the only people able to read it.
story_conflict: Some want the houses' stores opened. Others fear finding their dead whole, or fear what Unity would do with the proof.
nearest_precedent: Data remanence on erased drives. Remanence leaves traces by accident. Ours, if it exists, was designed by ancestors who later said they were wrong.
links: [TECH-0003, TECH-0004, SOC-0003, MYST-0005]
```

```yaml
id: MYST-0007
title: The Children's Words
status: open
plausibility: n/a
summary: Unread-born children on the same limb are converging on shared new words their parents cannot learn. Nobody knows whether this is the start of a new shared mind-form or ordinary language-making among children.
rules_and_limits: No read mind can judge it from inside, and the converted parents are only partly outside it. It cannot be compared across Unread Houses quickly, because the houses rarely share children.
consequences: If it is a new standard forming by itself, Unity can argue that divergence merely trades one standard for another and adds mortality. If it is free language-making, Divergence has proof that the outward worlds would grow minds of their own.
story_conflict: Researchers want children from different Unread Houses brought together to test it. Parents refuse to have their children treated as evidence for any rail.
nearest_precedent: Nicaraguan Sign Language, which deaf children built together and adults could not fully learn. That language was a gain with no cost. Ours costs children who die once, and the rails need it to mean opposite things.
links: [MIND-0003, MYST-0005, PREM-0004, SOC-0006, TECH-0005]
```

```yaml
id: MYST-0008
title: Is Anyone Outward?
status: open
plausibility: n/a
summary: The region's charts of what lies past the next relay are older than the Standard. Because the road carries nothing inward, no living mind in the region knows whether the outward subtree holds ten thousand settled places or none. Every argument about the Hold assumes an answer.
rules_and_limits: No signal from outward can arrive by the road. A ship or sideways signal could carry news, but it would be decades to millennia old and unmarked.
consequences: If no one is outward, the Hold costs nothing and release saves nothing, so every rail needs the outward to be inhabited and none can prove it. Every far-work is sent on faith.
story_conflict: Someone who wants to send a ship outward to find out is opposed by every rail, because either answer would dissolve one of them.
nearest_precedent: Schrödinger's cat. The cat's state is settled by opening the box. Ours has no box to open within any lifetime.
links: [TECH-0001, HIST-0004, SOC-0008, PREM-0004]
```

```yaml
id: MYST-0009
title: The Hum
status: open
plausibility: n/a
summary: Listening bowls in every habitat pick up a faint signal from the region's cold outer dark that rises and falls over several days. Read houses filter it out as noise (TECH-0007). The far-limb Unread house lets it run, and its listener Imre has shown that the Hum's loudness follows the region's total radiated heat, summed over several nights and returned eleven wakings late. Nobody has read any content in it, and nobody knows whether it is a count kept by a mind or heat smeared back by dust.
rules_and_limits: The lag puts any source no farther than about five and a half light-days, and nearer if it takes time to respond (PHYS-0002). A thick dust cloud would also return heat late and summed, so the match alone does not prove a mind. It arrives sideways, not by the road, so it carries no standing. If it is slow minds (PHYS-0001), a reply in words would take years, and no read mind could understand it.
consequences: If it is a mind, something has watched the region's nightly heat, most of it the Correction's, for 160,000 years. If it is the Before, Unity's fear stands nearby in living form and Divergence's claim stands proven. The far house has already answered by shuttering (SOC-0013), so who speaks first is settled and who speaks next is not (POL-0006).
story_conflict: Imre wants to keep talking to it for the rest of her life. Every rail wants the region's voice to the cold to be its own, and the only proven language, heat, is one that only Unread Houses can afford to speak.
nearest_precedent: The Wow! signal of 1977, heard once and never again. Ours has been heard constantly and deliberately not heard for 160,000 years, and it answers to something we do every night.
links: [PHYS-0001, PHYS-0002, MYST-0003, MYST-0008, TECH-0003, TECH-0007, PLACE-0001, SOC-0011, SOC-0013, POL-0006, CHAR-0003]
```

```yaml
id: MYST-0010
title: What the Keepers Lose at Night
status: open
plausibility: n/a
summary: The Correction leaves any stateable conviction alone, so a read keeper can hold or release in Standard terms. But if a keeper's deepest reason for a vote cannot be stated in the Standard, it is smoothed each night, and the keeper wakes with the vote and without the reason. Pell's throat-wall lines suggest this is how the Before's nine came to open. Nobody knows whether it happens to the eight who sleep read now.
rules_and_limits: A read keeper cannot detect it in themselves (MIND-0002). A keeper's smoothed night-strips might show it, but no read mind can read them, and the boxes are in the custody of the keepers' lines. Only Unread readers could read them, and no line has allowed one.
consequences: Every vote at the throat in 160,000 years becomes suspect, holds included. Keepers' strip boxes become the most dangerous custody in the region (SOC-0012), since an answer either way would end someone's standing.
story_conflict: Comb-readers and much of the release rail want keepers' strip boxes opened to Unread readers. The keepers' lines refuse, and the hold rail backs them, because the boxes might prove the Hold is held by reasons its keepers no longer have.
nearest_precedent: The debate over false consciousness in political theory, which holds that some beliefs are imposed. Theorists argue it from outside. Here the imposition is nightly and literal, and only people outside it can read the evidence.
links: [TECH-0003, MIND-0002, ORG-0001, HIST-0005, SOC-0003, SOC-0012, POL-0005, MYST-0005, CHAR-0002]
```

```yaml
id: MYST-0011
title: What Is in the Blind?
status: open
plausibility: n/a
summary: The blind is the sealed pattern the gate refuses in every refusal test (TECH-0008). The craft holds that it is a working install that would dismantle the Standard's shared layer, written by Sol's makers alongside the Standard so the gate could be shown to refuse it. Nobody in the region has opened it, and nobody knows why Sol would send its own undoing with the Standard rather than only the lock against it.
rules_and_limits: The blind is held in a sealed store in the gate's housing. Opening it is no part of the craft, and nobody knows whether opening it would destroy it. Even if it is what the craft says, it cannot pass the gate, and no other door into a house's Correction is known.
consequences: If it is an undoing, Sol wrote a retraction with teeth 160,000 years before it sent one without them, which bears on what Sol meant from the start. It would also be the one thing in the region that could end the Standard if a door were ever found, which would make the throat house the most guarded place in the region. If it is something else, the craft has tested the gate against the wrong thing for 160,000 years.
story_conflict: Release-leaning wrights want it opened and read, and a door looked for. Halde wants it sealed, because an undoing with no door is safe and one with a door is not.
nearest_precedent: Naval sealed orders, opened only at a set point in a voyage. Ours have no point at which they open; their only purpose is to be refused.
links: [TECH-0008, TECH-0006, HIST-0002, HIST-0003, ORG-0002, MYST-0001, CHAR-0004]
```

## Decision log

Every stage so far, newest first. Dive 11 on 2026-11-17; dive 10 on 2026-11-16; all earlier stages on 2026-11-15.

| Stage | What changed | Decided by |
| --- | --- | --- |
| Dive 11: The relay engineers | Added ORG-0002 (the throat-wrights), TECH-0008 (the refusal test), SOC-0014 (the Wright's Silence), CHAR-0004 (Halde), MYST-0011 (what is in the blind). Revised TECH-0006 (who knows it; the gate fails closed; release only asks each child relay while the Gloss would install in every child it reached) and MYST-0001 (names who keeps quiet; not answered). Named Halde and Sef. Added a known in-world error. The Narrator witnessed the test and kept its error. No checkpoint due (2026-11-17) | Claude |
| Author rulings on the roadmap | Claude drafts story prose for the author's revision, replacing the original rule that the author writes it. The Arrival and dives 1 to 7 scenes are to be copied into the Scenes tab word for word; not yet done, because only the original chat holds them. Build sessions must refresh canon at every start (2026-11-16) | Author |
| Roadmap approved | Added the Roadmap tab: The Hold, then review after dive 15, then Ask the Narrator, the story cycle (flagship), and the keeper game. No canon entries changed (2026-11-16) | Claude proposed; author approved |
| Build brief added | Added the Build brief tab for a Claude Code session: The Hold, a static web app that displays canon and never changes it. Dive runs still write no code. No canon entries changed (2026-11-16) | Author requested; Claude decided |
| Dive 10: The Hum | Added PHYS-0002 (the eleven-waking lag), TECH-0007 (listening bowls), SOC-0013 (shuttering), POL-0006 (the first voice), CHAR-0003 (Imre). Revised MYST-0009, partly answered: the Hum's loudness follows the region's summed heat eleven wakings late; whether it is a mind or a dust echo stays open. The far house answered by shuttering, without asking any rail. Named Imre. No checkpoint due | Claude |
| Dive 9: Orrin's Handing | Added HIST-0006 (the Handing), POL-0005 (the keeper's sleep), CHAR-0002 (Ione), MYST-0010 (what the keepers lose at night). Revised HIST-0005 and MYST-0003 (Pell's throat-wall reading) and ORG-0001 (keepers sleep read; Ione sleeps glossed). Named Ione, Asha, Hesk. Orrin died once. Story checkpoint 1 written | Claude |
| Dive 8: custody and exchange | Added SOC-0011 (heat-debt), SOC-0012 (custody), POL-0004 (the Remaking Order). Revised TECH-0003 (smoothing cost rises with how much is smoothed) and TECH-0004 (capacity and held readings). Named Dov | Claude |
| Autonomy set up | Added the Run book and Scenes tabs. A scheduled task runs one dive daily at 06:47 Nairobi time, pausing after dive 15 | Author requested; Claude built |
| Dive 7: the Before | Added HIST-0005, PHYS-0001, SOC-0010, PLACE-0003, MYST-0009. Revised MYST-0003 (records survive; minds open). Named Pell | Claude |
| Authority reaffirmed | Author confirmed full autonomy on 2026-11-15 | Author |
| Canon compile | Consistency edits only: HIST-0004, ORG-0001, POL-0001 (renamed "The Rails"), CHAR-0001 now reflect three rails. POL-0002 states children cannot lodge refusals. SOC-0003 and SOC-0007 note the Glossed House. MYST-0005 notes the visitor is not a reader. MYST-0003 reserved for dive 7 | Claude |
| Authority | Author delegated all decisions to Claude; all non-mystery entries set to established | Author |
| Dive 6: the Gloss | Added TECH-0005, TECH-0006, POL-0003, PLACE-0002. Revised HIST-0003, MYST-0001, PREM-0004. Named Maru and Teo | Claude |
| Dive 5: template craft | Added SOC-0008, SOC-0009, MYST-0008. Revised TECH-0001 (outward-only road) and HIST-0002 | Claude (default taken) |
| Dive 4: Unread childhood | Added MIND-0003, SOC-0006, SOC-0007, MYST-0007. Revised PREM-0004 | Claude (subject chosen) |
| Dive 3: reconstruction | Added TECH-0004, POL-0002, SOC-0004, SOC-0005, MYST-0006. Revised PLACE-0001 (Unread are mortal) | Claude; mortality accepted by author's "proceed" |
| Visitor ruling | The 2026 visitor is a framing device, not canon. Dive 2 ending rewritten | Author approved |
| Dive 2: the Correction | Added TECH-0003, SOC-0003, PLACE-0001, MYST-0005. Revised MIND-0002 | Claude (subject chosen) |
| Narrator ruling | The Narrator is a witness and holds no key. Added CHAR-0001 | Author |
| Dive 1: the keepers | Added TECH-0002, POL-0001, SOC-0001, SOC-0002, MYST-0004. Revised ORG-0001 | Claude (subject chosen) |
| Phase 1B | Added 15 seed entries | Claude; author said "proceed" |
| Phase 1A | Arrival scene | Claude |

### Known in-world errors

These are things characters believe that canon shows are false. Keep them; they are features.

| Belief | Held by | Truth |
| --- | --- | --- |
| Only Sol could have sent a retraction with teeth | The Narrator, most of the region | No one could, because of the Admission Rule (TECH-0006) |
| Release and the Gloss are the same kind of act at the throat | The release rail, most of the region | Release only asks each child relay, which may hold in turn; the Gloss would install in every child it reached (TECH-0006). Only the throat-wrights know, and they keep quiet (SOC-0014) |

### Scene lines that no longer match canon

| Scene | Line | Status |
| --- | --- | --- |
| Arrival | Narrator says it does not open the throat and is "one of the ones who have not" | Superseded: Narrator holds no key (CHAR-0001). Replacement lines proposed in chat |
| Dive 1 | Scene narrated by a keeper with a key in the wrist | Superseded: re-attribute to an unnamed holdout keeper, observed by the Narrator |
| Dive 2 | Ending in which Vane asks the visitor whether it kept the line | Superseded: Vane asks the Narrator, which does not have it |
