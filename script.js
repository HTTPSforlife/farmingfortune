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

        // Fetch SkyBlock profiles from Hypixel API
        const apiKey = '210dba0d-4d78-4fd0-b460-0beeb52807a4';
        const hypixelResponse = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`);
        if (!hypixelResponse.ok) {
            throw new Error('Failed to fetch SkyBlock profiles.');
        }
        const hypixelData = await hypixelResponse.json();
        if (!hypixelData.success || !hypixelData.profiles) {
            throw new Error('Player not found on Hypixel.');
        }

        // Assuming the first profile is the one we want
        const profile = hypixelData.profiles[0];
        const profileData = profile.members[uuid];

        // Analyze the profile data to find farming fortune-related items
        let farmingFortune = 0;
        const upgrades = [];

        // Example: Analyzing inventory, wardrobe, ender chest, and pets (simplified)
        const analyzeItems = (items) => {
            items.forEach(item => {
                if (item && item.nbt && item.nbt.tag && item.nbt.tag.ExtraAttributes) {
                    const attributes = item.nbt.tag.ExtraAttributes;
                    if (attributes.farming_fortune) {
                        farmingFortune += attributes.farming_fortune;
                        upgrades.push({
                            name: item.nbt.tag.display.Name,
                            farmingFortune: attributes.farming_fortune
                        });
                    }
                }
            });
        };

        // Assuming inventory, wardrobe, ender_chest, and pets are arrays of item objects
        analyzeItems(profileData.inventory);
        analyzeItems(profileData.wardrobe);
        analyzeItems(profileData.ender_chest);
        analyzeItems(profileData.pets);

        resultsDiv.innerHTML = `<h2>${username}'s Farming Fortune</h2>`;
        resultsDiv.innerHTML += `<p>Total Farming Fortune: ${farmingFortune}</p>`;
        resultsDiv.innerHTML += `<h3>Upgrades:</h3>`;
        const upgradesList = document.createElement('ul');
        for (const upgrade of upgrades) {
            const listItem = document.createElement('li');
            listItem.textContent = `${upgrade.name}: ${upgrade.farmingFortune}`;
            upgradesList.appendChild(listItem);
        }
        resultsDiv.appendChild(upgradesList);
    } catch (error) {
        resultsDiv.innerHTML = `Error: ${error.message}`;
    }
}
