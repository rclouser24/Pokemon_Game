class Trainer{
    name: string;
    pokemonTeam: Pokemon[];

    constructor (name: string, pokemonTeam: Pokemon[]){
        this.name = name;
        this.pokemonTeam = pokemonTeam;
    }

    //needs to be able to add a pokemon to the team
    async fetchPokemon() {
        try {
            const pokemonNameElement = document.getElementById("pokemonName") as HTMLInputElement;
            if (!pokemonNameElement) {
                throw new Error("Pokemon name input element not found");
            }
            const pokemonName = pokemonNameElement.value.toLowerCase();
    
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            
            if (this.pokemonTeam.length > 3){
                throw new Error ("You can't have more than 5 pokemon on your team");
                const errorMessage = document.getElementById("error") as HTMLDivElement;
                errorMessage.innerText = "You can't have more than 5 pokemon on your team";
            }

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log(data);

            const pokemonSprite = data.sprites.front_default;
            const imgElement = document.getElementById("pokemonSprite") as HTMLImageElement;

            if (!imgElement) {
                throw new Error("Pokemon sprite image element not found");
            }
    
            imgElement.src = pokemonSprite;
            imgElement.style.display = "inline";

            const newPokemon = new Pokemon(
                data.name,
                data.id,
                data.stats.find(stat => stat.stat.name === 'hp').base_stat, // HP
                pokemonSprite,
                data.stats.find(stat => stat.stat.name === 'attack').base_stat, // Attack
            );

            this.pokemonTeam.push(newPokemon);
            console.log(`${newPokemon.name} has been added to your team!`);

        } catch (error) {
            console.error(error);
        }

    }

    //needs to be able to remove a pokemon from the team
    removePokemon(pokemon: Pokemon){
        this.pokemonTeam = this.pokemonTeam.filter(poke => poke.name !== pokemon.name);
        console.log(`${pokemon.name} removed`);
    }
    //needs to be able to add a name to the trainer
    addTrainerName(){
        const trainerNameElement = document.getElementById("trainerName") as HTMLInputElement;
        this.name = trainerNameElement.value;
        this.displayTrainerName();
    }

    displayTrainerName(){
        const trainerNameElement = document.getElementById("trainerName") as HTMLDivElement;
        trainerNameElement.innerText = `Trainer: ${this.name}`;
        console.log(`Trainer: ${this.name}`);
    }

    //needs to be able to add pokemon to the team
}


class Pokemon {
    name: string;
    id: number;
    hp: number;
    image: string;
    attack: number;

    constructor (name: string, id: number, hp: number, image: string, attack: number){
        this.name = name;
        this.id = id;
        this.hp = hp;
        this.image = image;
        this.attack = attack;
    }
    
    //display pokemon name
    displayPokemon() {
        const pokemonImageElement = document.getElementById("pokemonSprite") as HTMLImageElement;
        const pokemonNameElement = document.getElementById("pokemonNameDisplay") as HTMLDivElement;
        const pokemonHPElement = document.getElementById("pokemonHPDisplay") as HTMLDivElement;
        const pokemonAttackElement = document.getElementById("pokemonAttackDisplay") as HTMLDivElement;

        if (pokemonNameElement) {
            pokemonNameElement.innerText = `Name: ${this.name}`;
        }

        if (pokemonImageElement) {
            pokemonImageElement.src = this.image;
            pokemonImageElement.style.display = "block";
        }

        if (pokemonHPElement) {
            pokemonHPElement.innerText = `HP: ${this.hp}`;
        }

        if (pokemonAttackElement) {
            pokemonAttackElement.innerText = `Attack: ${this.attack}`;
        }

        console.log(`Displaying ${this.name}`);
    }

    public attackPokemon(target: Pokemon) {
        // Ensure the attacker and target are alive
        if (this.hp <= 0) {
            console.log(`${this.name} cannot attack because it has fainted.`);
            return;
        }
    
        if (target.hp <= 0) {
            console.log(`${target.name} has already fainted.`);
            return;
        }
    
        // Calculate new HP for the target
        target.hp -= this.attack;
    
        // Ensure HP does not go below 0
        if (target.hp < 0) {
            target.hp = 0;
        }
    
        console.log(`${this.name} attacked ${target.name} for ${this.attack} damage!`);
        console.log(`${target.name}'s HP is now ${target.hp}.`);
    
        // Update the target's DOM
        target.updateHP(this.attack);
    }
    
    public updateHP(damage: number) {
        const pokemonHPElement = document.getElementById("pokemonHPDisplay") as HTMLDivElement;
    
        if (pokemonHPElement) {
            pokemonHPElement.innerText = `HP: ${this.hp}`;
    
            // Handle fainting logic
            if (this.hp <= 0) {
                console.log(`${this.name} has fainted!`);
                const faintedPokemon = document.getElementById("faintedPokemon") as HTMLDivElement;
                if (faintedPokemon) {
                    faintedPokemon.innerText = `${this.name} has fainted!`;
                }
                this.removePokemon();
            }
        }
    }


    removePokemon(){
        const pokemonImageElement = document.getElementById("pokemonSprite") as HTMLImageElement;
        const pokemonNameElement = document.getElementById("pokemonNameDisplay") as HTMLDivElement;
        const pokemonHPElement = document.getElementById("pokemonHPDisplay") as HTMLDivElement;
        const pokemonAttackElement = document.getElementById("pokemonAttackDisplay") as HTMLDivElement;

        pokemonImageElement.style.display = "none";
        pokemonImageElement.remove();

        pokemonNameElement.style.display = "none";
        pokemonNameElement.remove();

        pokemonHPElement.style.display = "none";
        pokemonHPElement.remove();

        pokemonAttackElement.style.display = "none";
        pokemonAttackElement.remove();
    }
}

class Enemy extends Pokemon {

    async fetchEnemyPokemon(){
        try{
            const enemyPokemonElement = document.getElementById("enemyPokemonSprite") as HTMLImageElement;

            const enemyPokemon = Math.floor(Math.random() * 152 + 1);

            const response = await fetch('https://pokeapi.co/api/v2/pokemon/1');
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);

            const pokemonSprite = data.sprites.front_default;
            const imgElement = document.getElementById("enemyPokemonSprite") as HTMLImageElement;

            if (!imgElement) {
                throw new Error("Pokemon sprite image element not found");
            }

            imgElement.src = pokemonSprite;
            imgElement.style.display = "inline";

            const newEnemyPokemon = new Enemy(
                data.name,
                data.id,
                data.stats.find(stat => stat.stat.name === 'hp').base_stat, // HP
                data.image,
                data.stats.find(stat => stat.stat.name === 'attack').base_stat, // attack
            );

            console.log(`${newEnemyPokemon.name} has appeared!`);

        }

        catch (error){
            console.log(error);
        }
    }

        displayEnemyPokemon(){
        const enemyPokemonImageElement = document.getElementById("enemyPokemonSprite") as HTMLImageElement;
        const enemyPokemonNameElement = document.getElementById("enemyPokemonNameDisplay") as HTMLDivElement;   
        const enemyPokemonHPElement = document.getElementById("enemyPokemonHPDisplay") as HTMLDivElement;
        const enemyPokemonAttackElement = document.getElementById("enemyPokemonAttackDisplay") as HTMLDivElement;

        if(enemyPokemonNameElement){
            enemyPokemonNameElement.innerText = `Name: $(this.name)`;
        }
        
        if(enemyPokemonImageElement){
            enemyPokemonImageElement.innerText = this.image;
            enemyPokemonImageElement.style.display = "block";
        }

        if(enemyPokemonHPElement){
            enemyPokemonHPElement.innerText = `HP: $(this.name)`;
        }

        if(enemyPokemonAttackElement){
            enemyPokemonAttackElement.innerText = `Name: $(this.name)`;
        }
    }

    public enemyAttackPokemon(target: Pokemon) {
        if (this.hp <= 0) {
            console.log(`${this.name} cannot attack because it has fainted.`);
            return;
        }
    
        if (target.hp <= 0) {
            console.log(`${target.name} has already fainted.`);
            return;
        }
    
        // Calculate new HP for the target
        target.hp -= this.attack;
    
        // Ensure HP does not go below 0
        if (target.hp < 0) {
            target.hp = 0;
        }
    
        console.log(`${this.name} attacked ${target.name} for ${this.attack} damage!`);
        console.log(`${target.name}'s HP is now ${target.hp}.`);
    
        // Update the target's DOM
        target.updateHP(this.attack);
    }
    
    public updateEnemyHP() {
        const enemyPokemonHP = document.getElementById("enemyPokemonHPDisplay") as HTMLDivElement;
    
        if (enemyPokemonHP) {
            enemyPokemonHP.innerText = `HP: ${this.hp}`;
    
            if (this.hp <= 0) {
                console.log(`${this.name} has fainted!`);
                const faintedEnemyPokemon = document.getElementById("enemyPokemonFaint") as HTMLDivElement;
                if (faintedEnemyPokemon) {
                    faintedEnemyPokemon.innerText = `${this.name} has fainted!`;
                }
                this.removeEnemyPokemon();
            }
        }
    }

    removeEnemyPokemon(){
        const enemyPokemonImageElement = document.getElementById("enemyPokemonSprite") as HTMLImageElement;
        const enemyPokemonNameElement = document.getElementById("enemyPokemonNameDisplay") as HTMLDivElement;
        const enemyPokemonHPElement = document.getElementById("enemyPokemonHPDisplay") as HTMLDivElement;
        const enemyPokemonAttackElement = document.getElementById("enemyPokemonAttackDisplay") as HTMLDivElement;

        enemyPokemonImageElement.style.display = "none";
        enemyPokemonImageElement.remove();

        enemyPokemonNameElement.style.display = "none";
        enemyPokemonNameElement.remove();

        enemyPokemonHPElement.style.display = "none";
        enemyPokemonHPElement.remove();

        enemyPokemonAttackElement.style.display = "none";
        enemyPokemonAttackElement.remove();
    }
}




