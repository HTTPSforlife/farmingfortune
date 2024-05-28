async function getFarmingFortune() {
    const username = document.getElementById('username').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!username) {
        resultsDiv.innerHTML = 'Please enter a username.';
        return;
    }

    try {
        // Fetch UUID from Mojang API
        const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (!uuidResponse.ok) {
            throw new Error('Username not found.');
        }
        const uuidData = await uuidResponse.json();
        const uuid = uuidData.id;

        // Fetch player data from Hypixel API
        const apiKey = '210dba0d-4d78-4fd0-b460-0beeb52807a4';
        const hypixelResponse = await fetch(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`);
        if (!hypixelResponse.ok) {
            throw new Error('Failed to fetch player data.');
        }
        const hypixelData = await hypixelResponse.json();

        if (!hypixelData.success || !hypixelData.player) {
            throw new Error('Player not found on Hypixel.');
        }

        // Extract farming fortune and upgrades (hypothetical data extraction)
        const playerData = hypixelData.player;
        const farmingFortune = playerData.stats.SkyBlock.farming_fortune;
        const upgrades = playerData.stats.SkyBlock.upgrades;

        resultsDiv.innerHTML = `<h2>${username}'s Farming Fortune</h2>`;
        resultsDiv.innerHTML += `<p>Farming Fortune: ${farmingFortune}</p>`;
        resultsDiv.innerHTML += `<h3>Upgrades:</h3>`;
        const upgradesList = document.createElement('ul');
        for (const upgrade of upgrades) {
            const listItem = document.createElement('li');
            listItem.textContent = `${upgrade.name}: ${upgrade.level}`;
            upgradesList.appendChild(listItem);
        }
        resultsDiv.appendChild(upgradesList);
    } catch (error) {
        resultsDiv.innerHTML = `Error: ${error.message}`;
    }
}
