import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('skillMultipliers')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('skillMultipliers').insert([
        // Gunnery
        { skillId: 3300, multiplier: 1 },
        { skillId: 3301, multiplier: 1 },
        { skillId: 3302, multiplier: 1 },
        { skillId: 3303, multiplier: 1 },
        { skillId: 3304, multiplier: 3 },
        { skillId: 3305, multiplier: 3 },
        { skillId: 3306, multiplier: 3 },
        { skillId: 3307, multiplier: 5 },
        { skillId: 3308, multiplier: 5 },
        { skillId: 3309, multiplier: 5 },
        { skillId: 3310, multiplier: 2 },
        { skillId: 3311, multiplier: 2 },
        { skillId: 3312, multiplier: 2 },
        { skillId: 3315, multiplier: 4 },
        { skillId: 3316, multiplier: 4 },
        { skillId: 3317, multiplier: 5 },
        { skillId: 11082, multiplier: 3 },
        { skillId: 11083, multiplier: 3 },
        { skillId: 11084, multiplier: 3 },
        { skillId: 12201, multiplier: 3 },
        { skillId: 12202, multiplier: 5 },
        { skillId: 12203, multiplier: 8 },
        { skillId: 12204, multiplier: 5 },
        { skillId: 12205, multiplier: 8 },
        { skillId: 12206, multiplier: 5 },
        { skillId: 12207, multiplier: 8 },
        { skillId: 12208, multiplier: 5 },
        { skillId: 12209, multiplier: 8 },
        { skillId: 12210, multiplier: 3 },
        { skillId: 12211, multiplier: 5 },
        { skillId: 12212, multiplier: 8 },
        { skillId: 12213, multiplier: 3 },
        { skillId: 12214, multiplier: 5 },
        { skillId: 12215, multiplier: 8 },
        { skillId: 20327, multiplier: 7 },
        { skillId: 21666, multiplier: 7 },
        { skillId: 21667, multiplier: 7 },
        { skillId: 22043, multiplier: 8 },
        { skillId: 24563, multiplier: 14 },
        { skillId: 41403, multiplier: 10 },
        { skillId: 41404, multiplier: 10 },
        { skillId: 41405, multiplier: 10 },
        { skillId: 41406, multiplier: 10 },
        { skillId: 41407, multiplier: 10 },
        { skillId: 41408, multiplier: 10 },
        { skillId: 41537, multiplier: 14 },
        { skillId: 47870, multiplier: 1 },
        { skillId: 47871, multiplier: 3 },
        { skillId: 47872, multiplier: 5 },
        { skillId: 47873, multiplier: 3 },
        { skillId: 47874, multiplier: 5 },
        { skillId: 47875, multiplier: 8 },
        // Missiles
        { skillId: 3319, multiplier: 1 }, // Missile Launcher Operation
        { skillId: 3320, multiplier: 1 }, // Rockets
        { skillId: 3321, multiplier: 2 }, // Light Missiles
        { skillId: 3322, multiplier: 3 }, // Auto-Targeting Missiles
        { skillId: 3323, multiplier: 2 }, // Defender Missiles
        { skillId: 3324, multiplier: 3 }, // Heavy Missiles
        { skillId: 3325, multiplier: 4 }, // Torpedoes
        { skillId: 3326, multiplier: 5 }, // Cruise Missiles
        { skillId: 12441, multiplier: 2 }, // Missile Bombardment
        { skillId: 12442, multiplier: 4 }, // Missile Projection
        { skillId: 20209, multiplier: 3 }, // Rocket Specialization
        { skillId: 20210, multiplier: 3 }, // Light Missile Specialization
        { skillId: 20211, multiplier: 5 }, // Heavy Missile Specialization
        { skillId: 20212, multiplier: 8 }, // Cruise Missile Specialization
        { skillId: 20213, multiplier: 8 }, // Torpedo Specialization
        { skillId: 20312, multiplier: 5 }, // Guided Missile Precision
        { skillId: 20314, multiplier: 2 }, // Target Navigation Prediction
        { skillId: 20315, multiplier: 5 }, // Warhead Upgrades
        { skillId: 21071, multiplier: 2 }, // Rapid Launch
        { skillId: 21668, multiplier: 7 }, // XL Torpedoes
        { skillId: 25718, multiplier: 5 }, // Heavy Assault Missile Specialization
        { skillId: 25719, multiplier: 3 }, // Heavy Assault Missiles
        { skillId: 28073, multiplier: 4 }, // Bomb Deployment
        { skillId: 32435, multiplier: 7 }, // XL Cruise Missiles
        { skillId: 41409, multiplier: 10 }, // XL Torpedo Specialization
        { skillId: 41410, multiplier: 10 }, // XL Cruise Missile Specialization
        // Spaceship command
        { skillId: 3184, multiplier: 4 }, // ORE Industrial
        { skillId: 3327, multiplier: 1 }, // Spaceship Command
        { skillId: 3328, multiplier: 2 }, // Gallente Frigate
        { skillId: 3329, multiplier: 2 }, // Minmatar Frigate
        { skillId: 3330, multiplier: 2 }, // Caldari Frigate
        { skillId: 3331, multiplier: 2 }, // Amarr Frigate
        { skillId: 3332, multiplier: 5 }, // Gallente Cruiser
        { skillId: 3333, multiplier: 5 }, // Minmatar Cruiser
        { skillId: 3334, multiplier: 5 }, // Caldari Cruiser
        { skillId: 3335, multiplier: 5 }, // Amarr Cruiser
        { skillId: 3336, multiplier: 8 }, // Gallente Battleship
        { skillId: 3337, multiplier: 8 }, // Minmatar Battleship
        { skillId: 3338, multiplier: 8 }, // Caldari Battleship
        { skillId: 3339, multiplier: 8 }, // Amarr Battleship
        { skillId: 3340, multiplier: 4 }, // Gallente Industrial
        { skillId: 3341, multiplier: 4 }, // Minmatar Industrial
        { skillId: 3342, multiplier: 4 }, // Caldari Industrial
        { skillId: 3343, multiplier: 4 }, // Amarr Industrial
        { skillId: 3344, multiplier: 16 }, // Gallente Titan
        { skillId: 3345, multiplier: 16 }, // Minmatar Titan
        { skillId: 3346, multiplier: 16 }, // Caldari Titan
        { skillId: 3347, multiplier: 16 }, // Amarr Titan
        { skillId: 12092, multiplier: 4 }, // Interceptors
        { skillId: 12093, multiplier: 4 }, // Covert Ops
        { skillId: 12095, multiplier: 4 }, // Assault Frigates
        { skillId: 12096, multiplier: 6 }, // Logistics Cruisers
        { skillId: 12098, multiplier: 5 }, // Interdictors
        { skillId: 16591, multiplier: 6 }, // Heavy Assault Cruisers
        { skillId: 17940, multiplier: 4 }, // Mining Barge
        { skillId: 19719, multiplier: 6 }, // Transport Ships
        { skillId: 20342, multiplier: 5 }, // Advanced Spaceship Command
        { skillId: 20524, multiplier: 10 }, // Amarr Freighter
        { skillId: 20525, multiplier: 12 }, // Amarr Dreadnought
        { skillId: 20526, multiplier: 10 }, // Caldari Freighter
        { skillId: 20527, multiplier: 10 }, // Gallente Freighter
        { skillId: 20528, multiplier: 10 }, // Minmatar Freighter
        { skillId: 20530, multiplier: 12 }, // Caldari Dreadnought
        { skillId: 20531, multiplier: 12 }, // Gallente Dreadnought
        { skillId: 20532, multiplier: 12 }, // Minmatar Dreadnought
        { skillId: 20533, multiplier: 14 }, // Capital Ships
        { skillId: 22551, multiplier: 5 }, // Exhumers
        { skillId: 22761, multiplier: 6 }, // Recon Ships
        { skillId: 23950, multiplier: 8 }, // Command Ships
        { skillId: 24311, multiplier: 14 }, // Amarr Carrier
        { skillId: 24312, multiplier: 14 }, // Caldari Carrier
        { skillId: 24313, multiplier: 14 }, // Gallente Carrier
        { skillId: 24314, multiplier: 14 }, // Minmatar Carrier
        { skillId: 28374, multiplier: 12 }, // Capital Industrial Ships
        { skillId: 28609, multiplier: 6 }, // Heavy Interdiction Cruisers
        { skillId: 28615, multiplier: 4 }, // Electronic Attack Ships
        { skillId: 28656, multiplier: 10 }, // Black Ops
        { skillId: 28667, multiplier: 10 }, // Marauders
        { skillId: 29029, multiplier: 14 }, // Jump Freighters
        { skillId: 29637, multiplier: 8 }, // Industrial Command Ships
        { skillId: 30650, multiplier: 5 }, // Amarr Strategic Cruiser
        { skillId: 30651, multiplier: 5 }, // Caldari Strategic Cruiser
        { skillId: 30652, multiplier: 5 }, // Gallente Strategic Cruiser
        { skillId: 30653, multiplier: 5 }, // Minmatar Strategic Cruiser
        { skillId: 32918, multiplier: 2 }, // Mining Frigate
        { skillId: 33091, multiplier: 2 }, // Amarr Destroyer
        { skillId: 33092, multiplier: 2 }, // Caldari Destroyer
        { skillId: 33093, multiplier: 2 }, // Gallente Destroyer
        { skillId: 33094, multiplier: 2 }, // Minmatar Destroyer
        { skillId: 33095, multiplier: 6 }, // Amarr Battlecruiser
        { skillId: 33096, multiplier: 6 }, // Caldari Battlecruiser
        { skillId: 33097, multiplier: 6 }, // Gallente Battlecruiser
        { skillId: 33098, multiplier: 6 }, // Minmatar Battlecruiser
        { skillId: 33856, multiplier: 4 }, // Expedition Frigates
        { skillId: 34327, multiplier: 9 }, // ORE Freighter
        { skillId: 34390, multiplier: 3 }, // Amarr Tactical Destroyer
        { skillId: 34533, multiplier: 3 }, // Minmatar Tactical Destroyer
        { skillId: 35680, multiplier: 3 }, // Caldari Tactical Destroyer
        { skillId: 35685, multiplier: 3 }, // Gallente Tactical Destroyer
        { skillId: 37615, multiplier: 6 }, // Command Destroyers
        { skillId: 40328, multiplier: 4 }, // Logistics Frigates
        { skillId: 47445, multiplier: 8 }, // Flag Cruisers
        { skillId: 47867, multiplier: 2 }, // Precursor Frigate
        { skillId: 47868, multiplier: 5 }, // Precursor Cruiser
        { skillId: 47869, multiplier: 8 }, // Precursor Battleship
        { skillId: 49742, multiplier: 2 }, // Precursor Destroyer
        { skillId: 49743, multiplier: 6 }, // Precursor Battlecruiser }
        // Fleet support
        { skillId: 3348, multiplier: 1 }, // Leadership
        { skillId: 3349, multiplier: 2 }, // Skirmish Command
        { skillId: 3350, multiplier: 2 }, // Shield Command
        { skillId: 3351, multiplier: 5 }, // Shield Command Specialist
        { skillId: 3352, multiplier: 5 }, // Information Command Specialist
        { skillId: 3354, multiplier: 6 }, // Command Burst Specialist
        { skillId: 11569, multiplier: 5 }, // Armored Command Specialist
        { skillId: 11572, multiplier: 5 }, // Skirmish Command Specialist
        { skillId: 11574, multiplier: 8 }, // Wing Command
        { skillId: 20494, multiplier: 2 }, // Armored Command
        { skillId: 20495, multiplier: 2 }, // Information Command
        { skillId: 22536, multiplier: 2 }, // Mining Foreman
        { skillId: 22552, multiplier: 5 }, // Mining Director
        { skillId: 24764, multiplier: 12 }, // Fleet Command
        { skillId: 43728, multiplier: 10 }, // Spatial Phenomena Generation
        // Corporation management
        { skillId: 3363, multiplier: 1 }, // Corporation Management
        { skillId: 3368, multiplier: 2 }, // Diplomatic Relations
        { skillId: 3731, multiplier: 3 }, // Megacorp Management
        { skillId: 3732, multiplier: 5 }, // Empire Control
        { skillId: 12241, multiplier: 8 }, // Sovereignty
        // Production
        { skillId: 3380, multiplier: 1 }, // Industry
        { skillId: 3387, multiplier: 2 }, // Mass Production
        { skillId: 3388, multiplier: 3 }, // Advanced Industry
        { skillId: 3395, multiplier: 2 }, // Advanced Small Ship Construction
        { skillId: 3396, multiplier: 3 }, // Advanced Industrial Ship Construction
        { skillId: 3397, multiplier: 5 }, // Advanced Medium Ship Construction
        { skillId: 3398, multiplier: 8 }, // Advanced Large Ship Construction
        { skillId: 3400, multiplier: 16 }, // Outpost Construction
        { skillId: 22242, multiplier: 14 }, // Capital Ship Construction
        { skillId: 24268, multiplier: 3 }, // Supply Chain Management
        { skillId: 24625, multiplier: 8 }, // Advanced Mass Production
        { skillId: 26224, multiplier: 2 }, // Drug Manufacturing
        // Rigging
        { skillId: 26252, multiplier: 2 }, // Jury Rigging
        { skillId: 26253, multiplier: 3 }, // Armor Rigging
        { skillId: 26254, multiplier: 3 }, // Astronautics Rigging
        { skillId: 26255, multiplier: 3 }, // Drones Rigging
        { skillId: 26256, multiplier: 3 }, // Electronic Superiority Rigging
        { skillId: 26257, multiplier: 3 }, // Projectile Weapon Rigging
        { skillId: 26258, multiplier: 3 }, // Energy Weapon Rigging
        { skillId: 26259, multiplier: 3 }, // Hybrid Weapon Rigging
        { skillId: 26260, multiplier: 3 }, // Launcher Rigging
        { skillId: 26261, multiplier: 3 }, // Shield Rigging
        // Science
        { skillId: 3402, multiplier: 1 }, // Science
        { skillId: 3403, multiplier: 1 }, // Research
        { skillId: 3406, multiplier: 1 }, // Laboratory Operation
        { skillId: 3408, multiplier: 4 }, // Sleeper Encryption Methods
        { skillId: 3409, multiplier: 3 }, // Metallurgy
        { skillId: 11433, multiplier: 5 }, // High Energy Physics
        { skillId: 11441, multiplier: 5 }, // Plasma Physics
        { skillId: 11442, multiplier: 5 }, // Nanite Engineering
        { skillId: 11443, multiplier: 5 }, // Hydromagnetic Physics
        { skillId: 11444, multiplier: 5 }, // Amarr Starship Engineering
        { skillId: 11445, multiplier: 5 }, // Minmatar Starship Engineering
        { skillId: 11446, multiplier: 5 }, // Graviton Physics
        { skillId: 11447, multiplier: 5 }, // Laser Physics
        { skillId: 11448, multiplier: 5 }, // Electromagnetic Physics
        { skillId: 11449, multiplier: 5 }, // Rocket Science
        { skillId: 11450, multiplier: 5 }, // Gallente Starship Engineering
        { skillId: 11451, multiplier: 5 }, // Nuclear Physics
        { skillId: 11452, multiplier: 5 }, // Mechanical Engineering
        { skillId: 11453, multiplier: 5 }, // Electronic Engineering
        { skillId: 11454, multiplier: 5 }, // Caldari Starship Engineering
        { skillId: 11455, multiplier: 5 }, // Quantum Physics
        { skillId: 11487, multiplier: 5 }, // Astronautic Engineering
        { skillId: 11529, multiplier: 5 }, // Molecular Engineering
        { skillId: 12179, multiplier: 8 }, // Research Project Management
        { skillId: 20433, multiplier: 5 }, // Talocan Technology
        { skillId: 21789, multiplier: 5 }, // Sleeper Technology
        { skillId: 21790, multiplier: 5 }, // Caldari Encryption Methods
        { skillId: 21791, multiplier: 5 }, // Minmatar Encryption Methods
        { skillId: 23087, multiplier: 5 }, // Amarr Encryption Methods
        { skillId: 23121, multiplier: 5 }, // Gallente Encryption Methods
        { skillId: 23123, multiplier: 5 }, // Takmahl Technology
        { skillId: 23124, multiplier: 5 }, // Yan Jung Technology
        { skillId: 24270, multiplier: 3 }, // Scientific Networking
        { skillId: 24624, multiplier: 8 }, // Advanced Laboratory Operation
        { skillId: 30324, multiplier: 5 }, // Defensive Subsystem Technology
        { skillId: 30325, multiplier: 5 }, // Core Subsystem Technology
        { skillId: 30327, multiplier: 5 }, // Offensive Subsystem Technology
        { skillId: 30788, multiplier: 5 }, // Propulsion Subsystem Technology
        { skillId: 52307, multiplier: 5 }, // Triglavian Quantum Engineering
        { skillId: 52308, multiplier: 4 }, // Triglavian Encryption Methods
        // Electronic warfare
        { skillId: 3427, multiplier: 2 }, // Electronic Warfare
        { skillId: 3433, multiplier: 3 }, // Sensor Linking
        { skillId: 3434, multiplier: 3 }, // Weapon Disruption
        { skillId: 3435, multiplier: 3 }, // Propulsion Jamming
        { skillId: 4411, multiplier: 5 }, // Target Breaker Amplification
        { skillId: 11579, multiplier: 6 }, // Cloaking
        { skillId: 19759, multiplier: 4 }, // Long Distance Jamming
        { skillId: 19760, multiplier: 3 }, // Frequency Modulation
        { skillId: 19761, multiplier: 5 }, // Signal Dispersion
        { skillId: 19766, multiplier: 5 }, // Signal Suppression
        { skillId: 19767, multiplier: 5 }, // Weapon Destabilization
        { skillId: 19921, multiplier: 3 }, // Target Painting
        { skillId: 19922, multiplier: 5 }, // Signature Focusing
        { skillId: 27906, multiplier: 8 }, // Tactical Logistics Reconfiguration
        { skillId: 27911, multiplier: 8 }, // Burst Projector Operation
        // Drones
        { skillId: 3436, multiplier: 1 }, // Drones
        { skillId: 3437, multiplier: 1 }, // Drone Avionics
        { skillId: 3438, multiplier: 2 }, // Mining Drone Operation
        { skillId: 3439, multiplier: 3 }, // Repair Drone Operation
        { skillId: 3440, multiplier: 4 }, // Salvage Drone Operation
        { skillId: 3441, multiplier: 5 }, // Heavy Drone Operation
        { skillId: 3442, multiplier: 5 }, // Drone Interfacing
        { skillId: 12305, multiplier: 1 }, // Drone Navigation
        { skillId: 12484, multiplier: 5 }, // Amarr Drone Specialization
        { skillId: 12485, multiplier: 5 }, // Minmatar Drone Specialization
        { skillId: 12486, multiplier: 5 }, // Gallente Drone Specialization
        { skillId: 12487, multiplier: 5 }, // Caldari Drone Specialization
        { skillId: 22541, multiplier: 5 }, // Mining Drone Specialization
        { skillId: 23069, multiplier: 12 }, // Fighters
        { skillId: 23566, multiplier: 5 }, // Advanced Drone Avionics
        { skillId: 23594, multiplier: 5 }, // Sentry Drone Interfacing
        { skillId: 23606, multiplier: 1 }, // Drone Sharpshooting
        { skillId: 23618, multiplier: 5 }, // Drone Durability
        { skillId: 24241, multiplier: 1 }, // Light Drone Operation
        { skillId: 24613, multiplier: 8 }, // Fighter Hangar Management
        { skillId: 32339, multiplier: 12 }, // Heavy Fighters
        { skillId: 33699, multiplier: 2 }, // Medium Drone Operation
        { skillId: 40572, multiplier: 12 }, // Light Fighters
        { skillId: 40573, multiplier: 12 }, // Support Fighters
        { skillId: 43702, multiplier: 2 }, // Ice Harvesting Drone Operation
        { skillId: 43703, multiplier: 5 }, // Ice Harvesting Drone Specialization
        // Trade
        { skillId: 3443, multiplier: 1 }, // Trade
        { skillId: 3444, multiplier: 2 }, // Retail
        { skillId: 3446, multiplier: 2 }, // Broker Relations
        { skillId: 3447, multiplier: 3 }, // Visibility
        { skillId: 16594, multiplier: 3 }, // Procurement
        { skillId: 16595, multiplier: 1 }, // Daytrading
        { skillId: 16596, multiplier: 4 }, // Wholesale
        { skillId: 16597, multiplier: 3 }, // Margin Trading
        { skillId: 16598, multiplier: 3 }, // Marketing
        { skillId: 16622, multiplier: 3 }, // Accounting
        { skillId: 18580, multiplier: 6 }, // Tycoon
        { skillId: 25233, multiplier: 3 }, // Corporation Contracting
        { skillId: 25235, multiplier: 1 }, // Contracting
        { skillId: 33467, multiplier: 2 }, // Customs Code Expertise
        // Navigation
        { skillId: 3449, multiplier: 1 }, // Navigation
        { skillId: 3450, multiplier: 1 }, // Afterburner
        { skillId: 3451, multiplier: 2 }, // Fuel Conservation
        { skillId: 3452, multiplier: 4 }, // Acceleration Control
        { skillId: 3453, multiplier: 2 }, // Evasive Maneuvering
        { skillId: 3454, multiplier: 5 }, // High Speed Maneuvering
        { skillId: 3455, multiplier: 1 }, // Warp Drive Operation
        { skillId: 3456, multiplier: 5 }, // Jump Drive Operation
        { skillId: 4385, multiplier: 5 }, // Micro Jump Drive Operation
        { skillId: 21603, multiplier: 5 }, // Cynosural Field Theory
        { skillId: 21610, multiplier: 8 }, // Jump Fuel Conservation
        { skillId: 21611, multiplier: 9 }, // Jump Drive Calibration
        { skillId: 24562, multiplier: 14 }, // Jump Portal Generation
        // Social
        { skillId: 3355, multiplier: 1 }, // Social
        { skillId: 3356, multiplier: 2 }, // Negotiation
        { skillId: 3357, multiplier: 1 }, // Diplomacy
        { skillId: 3358, multiplier: 4 }, // Fast Talk
        { skillId: 3359, multiplier: 3 }, // Connections
        { skillId: 3361, multiplier: 3 }, // Criminal Connections
        { skillId: 3893, multiplier: 2 }, // Mining Connections
        { skillId: 3894, multiplier: 2 }, // Distribution Connections
        { skillId: 3895, multiplier: 2 }, // Security Connections
        // Shields
        { skillId: 3416, multiplier: 1 }, // Shield Operation
        { skillId: 3419, multiplier: 3 }, // Shield Management
        { skillId: 3420, multiplier: 4 }, // Tactical Shield Manipulation
        { skillId: 3422, multiplier: 2 }, // Shield Emission Systems
        { skillId: 3425, multiplier: 2 }, // Shield Upgrades
        { skillId: 11566, multiplier: 2 }, // Thermal Shield Compensation
        { skillId: 12365, multiplier: 2 }, // EM Shield Compensation
        { skillId: 12366, multiplier: 2 }, // Kinetic Shield Compensation
        { skillId: 12367, multiplier: 2 }, // Explosive Shield Compensation
        { skillId: 21059, multiplier: 2 }, // Shield Compensation
        { skillId: 21802, multiplier: 8 }, // Capital Shield Operation
        { skillId: 24571, multiplier: 10 }, // Capital Shield Emission Systems
        { skillId: 44067, multiplier: 8 }, // Invulnerability Core Operation
        // Armor
        { skillId: 3392, multiplier: 1 }, // Mechanics
        { skillId: 3393, multiplier: 1 }, // Repair Systems
        { skillId: 3394, multiplier: 2 }, // Hull Upgrades
        { skillId: 16069, multiplier: 2 }, // Remote Armor Repair Systems
        { skillId: 21803, multiplier: 8 }, // Capital Repair Systems
        { skillId: 22806, multiplier: 2 }, // EM Armor Compensation
        { skillId: 22807, multiplier: 2 }, // Explosive Armor Compensation
        { skillId: 22808, multiplier: 2 }, // Kinetic Armor Compensation
        { skillId: 22809, multiplier: 2 }, // Thermal Armor Compensation
        { skillId: 24568, multiplier: 10 }, // Capital Remote Armor Repair Systems
        { skillId: 27902, multiplier: 2 }, // Remote Hull Repair Systems
        { skillId: 27936, multiplier: 10 }, // Capital Remote Hull Repair Systems
        { skillId: 33078, multiplier: 3 }, // Armor Layering
        // Targeting
        { skillId: 3428, multiplier: 2 }, // Long Range Targeting
        { skillId: 3429, multiplier: 1 }, // Target Management
        { skillId: 3430, multiplier: 3 }, // Advanced Target Management
        { skillId: 3431, multiplier: 1 }, // Signature Analysis
        { skillId: 32999, multiplier: 2 }, // Magnetometric Sensor Compensation
        { skillId: 33000, multiplier: 2 }, // Gravimetric Sensor Compensation
        { skillId: 33001, multiplier: 2 }, // Ladar Sensor Compensation
        { skillId: 33002, multiplier: 2 }, // Radar Sensor Compensation
        // Engineering
        { skillId: 3318, multiplier: 2 }, // Weapon Upgrades
        { skillId: 3413, multiplier: 1 }, // Power Grid Management
        { skillId: 3417, multiplier: 1 }, // Capacitor Systems Operation
        { skillId: 3418, multiplier: 3 }, // Capacitor Management
        { skillId: 3421, multiplier: 2 }, // Energy Pulse Weapons
        { skillId: 3423, multiplier: 2 }, // Capacitor Emission Systems
        { skillId: 3424, multiplier: 2 }, // Energy Grid Upgrades
        { skillId: 3426, multiplier: 1 }, // CPU Management
        { skillId: 3432, multiplier: 2 }, // Electronics Upgrades
        { skillId: 11207, multiplier: 6 }, // Advanced Weapon Upgrades
        { skillId: 24572, multiplier: 10 }, // Capital Capacitor Emission Systems
        { skillId: 28164, multiplier: 3 }, // Thermodynamics
        { skillId: 28879, multiplier: 2 }, // Nanite Operation
        { skillId: 28880, multiplier: 3 }, // Nanite Interfacing
        { skillId: 32797, multiplier: 3 }, // Resistance Phasing
        // Scanning
        { skillId: 3412, multiplier: 3 }, // Astrometrics
        { skillId: 3551, multiplier: 1 }, // Survey
        { skillId: 13278, multiplier: 3 }, // Archaeology
        { skillId: 21718, multiplier: 3 }, // Hacking
        { skillId: 25739, multiplier: 8 }, // Astrometric Rangefinding
        { skillId: 25810, multiplier: 5 }, // Astrometric Pinpointing
        { skillId: 25811, multiplier: 5 }, // Astrometric Acquisition
        // Resource processing
        { skillId: 3385, multiplier: 1 }, // Reprocessing
        { skillId: 3386, multiplier: 1 }, // Mining
        { skillId: 3389, multiplier: 3 }, // Reprocessing Efficiency
        { skillId: 3410, multiplier: 3 }, // Astrogeology
        { skillId: 11395, multiplier: 6 }, // Deep Core Mining
        { skillId: 12180, multiplier: 4 }, // Arkonor Processing
        { skillId: 12181, multiplier: 4 }, // Bistot Processing
        { skillId: 12182, multiplier: 4 }, // Crokite Processing
        { skillId: 12183, multiplier: 3 }, // Dark Ochre Processing
        { skillId: 12184, multiplier: 3 }, // Gneiss Processing
        { skillId: 12185, multiplier: 3 }, // Hedbergite Processing
        { skillId: 12186, multiplier: 2 }, // Hemorphite Processing
        { skillId: 12187, multiplier: 2 }, // Jaspet Processing
        { skillId: 12188, multiplier: 2 }, // Kernite Processing
        { skillId: 12189, multiplier: 5 }, // Mercoxit Processing
        { skillId: 12190, multiplier: 2 }, // Omber Processing
        { skillId: 12191, multiplier: 1 }, // Plagioclase Processing
        { skillId: 12192, multiplier: 1 }, // Pyroxeres Processing
        { skillId: 12193, multiplier: 1 }, // Scordite Processing
        { skillId: 12194, multiplier: 3 }, // Spodumain Processing
        { skillId: 12195, multiplier: 1 }, // Veldspar Processing
        { skillId: 12196, multiplier: 5 }, // Scrapmetal Processing
        { skillId: 16281, multiplier: 1 }, // Ice Harvesting
        { skillId: 18025, multiplier: 5 }, // Ice Processing
        { skillId: 22578, multiplier: 4 }, // Mining Upgrades
        { skillId: 25544, multiplier: 1 }, // Gas Cloud Harvesting
        { skillId: 25863, multiplier: 3 }, // Salvaging
        { skillId: 28585, multiplier: 8 }, // Industrial Reconfiguration
        { skillId: 45746, multiplier: 1 }, // Reactions
        { skillId: 45748, multiplier: 2 }, // Mass Reactions
        { skillId: 45749, multiplier: 8 }, // Advanced Mass Reactions
        { skillId: 45750, multiplier: 3 }, // Remote Reactions
        { skillId: 46152, multiplier: 4 }, // Ubiquitous Moon Ore Processing
        { skillId: 46153, multiplier: 5 }, // Common Moon Ore Processing
        { skillId: 46154, multiplier: 6 }, // Uncommon Moon Ore Processing
        { skillId: 46155, multiplier: 7 }, // Rare Moon Ore Processing
        { skillId: 46156, multiplier: 8 }, // Exceptional Moon Ore Processing
        // Neural enhancement
        { skillId: 3405, multiplier: 1 }, // Biology
        { skillId: 3411, multiplier: 3 }, // Cybernetics
        { skillId: 24242, multiplier: 1 }, // Infomorph Psychology
        { skillId: 24606, multiplier: 10 }, // Cloning Facility Operation
        { skillId: 25530, multiplier: 5 }, // Neurotoxin Recovery
        { skillId: 25538, multiplier: 2 }, // Neurotoxin Control
        { skillId: 33399, multiplier: 2 }, // Infomorph Synchronizing
        { skillId: 33407, multiplier: 5 }, // Advanced Infomorph Psychology
        // Subsystems
        { skillId: 30532, multiplier: 1 }, // Amarr Defensive Systems
        { skillId: 30537, multiplier: 1 }, // Amarr Offensive Systems
        { skillId: 30538, multiplier: 1 }, // Amarr Propulsion Systems
        { skillId: 30539, multiplier: 1 }, // Amarr Core Systems
        { skillId: 30540, multiplier: 1 }, // Gallente Defensive Systems
        { skillId: 30544, multiplier: 1 }, // Caldari Defensive Systems
        { skillId: 30545, multiplier: 1 }, // Minmatar Defensive Systems
        { skillId: 30546, multiplier: 1 }, // Gallente Core Systems
        { skillId: 30547, multiplier: 1 }, // Minmatar Core Systems
        { skillId: 30548, multiplier: 1 }, // Caldari Core Systems
        { skillId: 30549, multiplier: 1 }, // Caldari Offensive Systems
        { skillId: 30550, multiplier: 1 }, // Gallente Offensive Systems
        { skillId: 30551, multiplier: 1 }, // Minmatar Offensive Systems
        { skillId: 30552, multiplier: 1 }, // Caldari Propulsion Systems
        { skillId: 30553, multiplier: 1 }, // Gallente Propulsion Systems
        { skillId: 30554, multiplier: 1 }, // Minmatar Propulsion Systems
        // Planet management
        { skillId: 2403, multiplier: 5 }, // Advanced Planetology
        { skillId: 2406, multiplier: 3 }, // Planetology
        { skillId: 2495, multiplier: 4 }, // Interplanetary Consolidation
        { skillId: 2505, multiplier: 4 }, // Command Center Upgrades
        { skillId: 13279, multiplier: 1 }, // Remote Sensing
        // Structure management
        { skillId: 3373, multiplier: 7 }, // Starbase Defense Management
        { skillId: 11584, multiplier: 3 }, // Anchoring
        { skillId: 37796, multiplier: 2 }, // Structure Missile Systems
        { skillId: 37797, multiplier: 2 }, // Structure Doomsday Operation
        { skillId: 37798, multiplier: 2 }, // Structure Electronic Systems
        { skillId: 37799, multiplier: 2 }, // Structure Engineering Systems
      ]);
    });
}
