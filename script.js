const API_KEY = 'AIzaSyB9qD90l1vnOMEvCnRDsVIkvFcVay26f80';

const platformData = {
    omni: { badge: "Omni-Channel Engine", title: "Dominate <span class='gradient-text'>Every Platform</span>", desc: "Generate a complete, multi-platform content strategy from a single idea.", colorPrimary: "#9d4edd", colorSecondary: "#ff758f", isWide: true },
    youtube: { badge: "YouTube SEO Engine", title: "Master the <span class='gradient-text'>Algorithm</span>", desc: "Generate highly engaging, click-worthy titles, descriptions, and search-optimized tags.", colorPrimary: "#FF0050", colorSecondary: "#ff4d6d", isWide: false },
    tiktok: { badge: "TikTok Viral Engine", title: "Stop the <span class='gradient-text'>Scroll</span>", desc: "Create high-retention video scripts and audio strategies.", colorPrimary: "#00F2FE", colorSecondary: "#4FACFE", isWide: false },
    instagram: { badge: "Instagram Growth", title: "Build your <span class='gradient-text'>Aesthetic</span>", desc: "Create engaging captions, optimal hashtags, and AI image prompts.", colorPrimary: "#E1306C", colorSecondary: "#F56040", isWide: false },
    linkedin: { badge: "LinkedIn Thought Leadership", title: "Expand your <span class='gradient-text'>Network</span>", desc: "Write professional, viral posts that establish authority and drive connections.", colorPrimary: "#0077B5", colorSecondary: "#00A0DC", isWide: false },
    twitter: { badge: "Twitter / X Viral Engine", title: "Own the <span class='gradient-text'>Timeline</span>", desc: "Craft punchy tweets and engaging threads that maximize impressions.", colorPrimary: "#1DA1F2", colorSecondary: "#AAB8C2", isWide: false }
};

document.addEventListener('DOMContentLoaded', () => {
    let currentPlatform = '';
    let currentGenerationResult = null; // Store latest result for exports/refining
    let itemBeingRefined = null; // Store DOM reference for refining

    // Theme logic
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Brand Profile Logic
    const profileModal = document.getElementById('profileModal');
    const brandNameInput = document.getElementById('brandName');
    const brandAudienceInput = document.getElementById('brandAudience');
    const brandToneInput = document.getElementById('brandTone');

    const savedProfile = JSON.parse(localStorage.getItem('brandProfile') || '{}');
    if (savedProfile.name) brandNameInput.value = savedProfile.name;
    if (savedProfile.audience) brandAudienceInput.value = savedProfile.audience;
    if (savedProfile.tone) brandToneInput.value = savedProfile.tone;

    document.getElementById('profileBtn').addEventListener('click', () => profileModal.classList.remove('hidden'));
    document.getElementById('closeProfile').addEventListener('click', () => profileModal.classList.add('hidden'));

    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        const profile = { name: brandNameInput.value.trim(), audience: brandAudienceInput.value.trim(), tone: brandToneInput.value.trim() };
        localStorage.setItem('brandProfile', JSON.stringify(profile));
        const btn = document.getElementById('saveProfileBtn');
        btn.textContent = 'Saved!';
        setTimeout(() => { btn.textContent = 'Save Profile'; profileModal.classList.add('hidden'); }, 1000);
    });

    function getBrandContext() {
        const profile = JSON.parse(localStorage.getItem('brandProfile') || '{}');
        if (!profile.name && !profile.audience && !profile.tone) return "";
        let ctx = `\n--- MANDATORY BRAND PROFILE ---\n`;
        if (profile.name) ctx += `Brand Name: ${profile.name}\n`;
        if (profile.audience) ctx += `Global Audience: ${profile.audience}\n`;
        if (profile.tone) ctx += `Global Brand Tone: ${profile.tone}\n`;
        return ctx + `Ensure ALL generated content completely aligns with this brand profile.\n--------------------------------\n`;
    }

    // Navigation Logic
    const homeSelection = document.getElementById('homeSelection');
    const generatorArea = document.getElementById('generatorArea');
    const mainContainer = document.getElementById('mainContainer');
    
    function switchToPlatform(target) {
        currentPlatform = target;
        
        // Switch Views
        homeSelection.classList.remove('active-section');
        homeSelection.classList.add('hidden-section');
        generatorArea.classList.remove('hidden-section');
        generatorArea.classList.add('active-section');
        
        // Show Top Nav and Update Active Link
        const topNav = document.getElementById('topNavLinks');
        topNav.classList.remove('hidden');
        topNav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        const activeLink = topNav.querySelector(`a[data-target="${target}"]`);
        if (activeLink) activeLink.parentElement.classList.add('active');

        // Toggle Inputs
        document.querySelectorAll('.platform-inputs').forEach(p => p.classList.add('hidden'));
        document.getElementById(`inputs-${currentPlatform}`).classList.remove('hidden');
        
        // Update Hero
        const data = platformData[currentPlatform];
        document.getElementById('heroBadge').textContent = data.badge;
        document.getElementById('heroTitle').innerHTML = data.title;
        document.getElementById('heroDesc').textContent = data.desc;
        
        document.documentElement.style.setProperty('--primary', data.colorPrimary);
        document.documentElement.style.setProperty('--secondary', data.colorSecondary);
        mainContainer.className = data.isWide ? 'container' : 'container narrow';
        
        document.getElementById('outputArea').classList.add('hidden');
        document.getElementById('outputGrid').innerHTML = '';
    }

    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', () => switchToPlatform(card.getAttribute('data-target')));
    });

    document.querySelectorAll('#topNavLinks a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchToPlatform(link.getAttribute('data-target'));
        });
    });

    function goHome() {
        generatorArea.classList.remove('active-section');
        generatorArea.classList.add('hidden-section');
        homeSelection.classList.remove('hidden-section');
        homeSelection.classList.add('active-section');
        mainContainer.className = 'container';
        document.getElementById('topNavLinks').classList.add('hidden');
    }

    document.getElementById('backBtn').addEventListener('click', goHome);
    document.getElementById('homeLogo').addEventListener('click', goHome);

    // Generate Logic
    const generateBtn = document.getElementById('generateBtn');
    const loadingArea = document.getElementById('loadingArea');
    const outputArea = document.getElementById('outputArea');
    const outputGrid = document.getElementById('outputGrid');
    
    generateBtn.addEventListener('click', async () => {
        let prompt = buildPrompt(currentPlatform);
        if (!prompt) return;

        generateBtn.disabled = true;
        generateBtn.querySelector('span').style.display = 'none';
        generateBtn.querySelector('.loader').style.display = 'block';
        outputArea.classList.add('hidden');
        outputGrid.innerHTML = '';
        loadingArea.classList.remove('hidden');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!response.ok) {
                if (response.status === 503) throw new Error("Google's AI servers are temporarily overloaded (503). Please wait a moment and try again.");
                if (response.status === 404) throw new Error("The specified AI model is not accessible with this API key (404).");
                throw new Error(`Connection Error: HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const text = data.candidates[0].content.parts[0].text;
                const result = JSON.parse(text.replace(/^```json\n?/, '').replace(/\n?```$/, ''));
                currentGenerationResult = { platform: currentPlatform, data: result, timestamp: new Date().toISOString() };
                
                // Save to history
                saveToHistory(currentGenerationResult);

                renderOutput(result, currentPlatform);
            }
        } catch (error) {
            console.error("Generation Error:", error);
            outputGrid.innerHTML = `
                <div class="info-card" style="border-color: #ff4d6d; text-align: center; max-width: 600px; margin: 0 auto; background: rgba(255, 77, 109, 0.05);">
                    <i class="fas fa-exclamation-triangle" style="color: #ff4d6d; font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3 style="color: #ff4d6d; font-family: 'Outfit', sans-serif; font-size: 1.5rem; margin-bottom: 0.5rem;">Generation Failed</h3>
                    <p style="color: var(--text-main);">${error.message || "An unexpected error occurred while parsing the AI response."}</p>
                </div>
            `;
            outputGrid.className = 'omni-column';
            outputArea.classList.remove('hidden');
        } finally {
            generateBtn.disabled = false;
            generateBtn.querySelector('span').style.display = 'block';
            generateBtn.querySelector('.loader').style.display = 'none';
            loadingArea.classList.add('hidden');
        }
    });

    function buildPrompt(platform) {
        const brandCtx = getBrandContext();
        if (platform === 'omni') {
            const topic = document.getElementById('omni-topic').value.trim();
            if (!topic) { alert('Please enter Core Topic.'); return null; }
            return `You are a Master Omni-Channel Content Strategist. Topic: ${topic}. Target Audience: ${document.getElementById('omni-audience').value}. Tone: ${document.getElementById('omni-tone').value}.${brandCtx}
Create strategy for YouTube, TikTok, Instagram, LinkedIn, and Twitter. Include virality scores (1-100) and AI image generation prompts where applicable.
Format strictly as JSON:
{
  "youtube": { "titles": [..], "description_hook": "..", "tags": [..], "virality_score": 90, "virality_reason": ".." },
  "tiktok": { "script_outline": ["Hook: ..", "Body: .."], "audio_suggestion": "..", "virality_score": 95, "virality_reason": ".." },
  "instagram": { "captions": [..], "hashtags": [..], "image_prompt": "..", "virality_score": 85, "virality_reason": ".." },
  "linkedin": { "posts": [..], "hashtags": [..], "image_prompt": "..", "virality_score": 88, "virality_reason": ".." },
  "twitter": { "tweets": [..], "virality_score": 92, "virality_reason": ".." }
}`;
        }
        else if (platform === 'youtube') {
            const topic = document.getElementById('yt-topic').value.trim();
            if (!topic) { alert('Enter Topic.'); return null; }
            return `YouTube SEO strategist. Topic: ${topic}. Audience: ${document.getElementById('yt-audience').value}. Tone: ${document.getElementById('yt-tone').value}.${brandCtx}
Provide exactly 5 titles, description hook, 15 tags. Also provide virality_score (1-100) and virality_reason.
Format JSON: { "titles": [..], "description_hook": "..", "tags": [..], "virality_score": 90, "virality_reason": ".." }`;
        }
        else if (platform === 'tiktok') {
            const topic = document.getElementById('tk-topic').value.trim();
            if (!topic) { alert('Enter Topic.'); return null; }
            return `TikTok Viral scripter. Topic: ${topic}. Audience: ${document.getElementById('tk-audience').value}. Vibe: ${document.getElementById('tk-vibe').value}.${brandCtx}
Provide script_outline (array of steps: Hook, Body, CTA), audio_suggestion, virality_score, and virality_reason.
Format JSON: { "script_outline": [..], "audio_suggestion": "..", "virality_score": 90, "virality_reason": ".." }`;
        }
        else if (platform === 'instagram') {
            const topic = document.getElementById('ig-topic').value.trim();
            if (!topic) { alert('Enter Topic.'); return null; }
            return `Instagram Social Manager. Topic: ${topic}. Format: ${document.getElementById('ig-type').value}. Vibe: ${document.getElementById('ig-vibe').value}.${brandCtx}
Provide 3 captions, 25 hashtags, an image_prompt for Midjourney, virality_score, and virality_reason.
Format JSON: { "captions": [..], "hashtags": [..], "image_prompt": "..", "virality_score": 90, "virality_reason": ".." }`;
        }
        else if (platform === 'linkedin') {
            const topic = document.getElementById('li-topic').value.trim();
            if (!topic) { alert('Enter Topic.'); return null; }
            return `LinkedIn ghostwriter. Topic: ${topic}. Key Takeaway: ${document.getElementById('li-takeaway').value}. Tone: ${document.getElementById('li-tone').value}.${brandCtx}
Provide 2 post variations, 5 hashtags, image_prompt, virality_score, and virality_reason.
Format JSON: { "posts": [..], "hashtags": [..], "image_prompt": "..", "virality_score": 90, "virality_reason": ".." }`;
        }
        else if (platform === 'twitter') {
            const topic = document.getElementById('tw-topic').value.trim();
            if (!topic) { alert('Enter Topic.'); return null; }
            return `Twitter viral ghostwriter. Topic: ${topic}. Format: ${document.getElementById('tw-format').value}.${brandCtx}
Provide 3 tweets (or 5-part thread if requested), virality_score, and virality_reason.
Format JSON: { "tweets": [..], "virality_score": 90, "virality_reason": ".." }`;
        }
    }

    // Render Logic
    function renderOutput(result, platform) {
        outputGrid.innerHTML = '';
        if (platform === 'omni') {
            outputGrid.className = 'omni-grid';
            if (result.youtube) buildCol('YouTube', 'hero-youtube', result.youtube);
            if (result.tiktok) buildCol('TikTok', 'hero-tiktok', result.tiktok);
            if (result.instagram) buildCol('Instagram', 'hero-instagram', result.instagram);
            if (result.linkedin) buildCol('LinkedIn', 'hero-linkedin', result.linkedin);
            if (result.twitter) buildCol('Twitter / X', 'hero-twitter', result.twitter);
        } else {
            outputGrid.className = 'omni-column'; // Single col
            buildCol(platformData[platform].badge, `hero-${platform}`, result);
        }
        outputArea.classList.remove('hidden');
        setTimeout(() => outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    function buildCol(titleText, heroClass, data) {
        const col = document.createElement('div'); col.className = 'omni-column';
        const hero = document.createElement('div'); hero.className = `platform-hero ${heroClass}`; hero.textContent = titleText;
        col.appendChild(hero);

        if (data.virality_score) {
            const vDiv = document.createElement('div'); vDiv.className = 'desc-content';
            vDiv.innerHTML = `<span class="virality-badge">🔥 Virality Score: ${data.virality_score}/100</span><p>${data.virality_reason}</p>`;
            col.appendChild(createPanel('📈', 'Predictor', vDiv));
        }

        if (data.titles) col.appendChild(createPanel('✨', 'Titles', createListDOM(data.titles)));
        if (data.description_hook) col.appendChild(createPanel('📝', 'Hook', createTextDOM(data.description_hook)));
        if (data.script_outline) col.appendChild(createPanel('🎬', 'Script Outline', createListDOM(data.script_outline)));
        if (data.audio_suggestion) col.appendChild(createPanel('🎵', 'Audio Suggestion', createTextDOM(data.audio_suggestion)));
        if (data.captions) col.appendChild(createPanel('📸', 'Captions', createListDOM(data.captions)));
        if (data.posts) col.appendChild(createPanel('💼', 'Posts', createListDOM(data.posts)));
        if (data.tweets) col.appendChild(createPanel('🐦', 'Tweets / Thread', createListDOM(data.tweets)));
        if (data.image_prompt) {
            const wrapper = document.createElement('div');
            
            // Live Free Image via Pollinations
            const img = document.createElement('img');
            img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(data.image_prompt + " ultra high quality masterpiece")}`;
            img.style.width = '100%'; img.style.borderRadius = '12px'; img.style.marginBottom = '1rem';
            img.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            wrapper.appendChild(img);

            const pDiv = document.createElement('div'); pDiv.className = 'ai-prompt-box'; pDiv.textContent = data.image_prompt;
            wrapper.appendChild(pDiv);
            
            col.appendChild(createPanel('🎨', 'AI Generated Image', wrapper, createActionBtn('copy', data.image_prompt)));
        }
        if (data.tags || data.hashtags) {
            const tArray = data.tags || data.hashtags;
            col.appendChild(createPanel('🏷️', 'Tags', createTextDOM(tArray.join(' '))));
        }

        outputGrid.appendChild(col);
    }

    function createPanel(icon, title, contentDOM, extraHeader = null) {
        const panel = document.createElement('div'); panel.className = 'output-panel';
        const header = document.createElement('div'); header.className = 'output-header';
        header.innerHTML = `<h3>${icon} ${title}</h3>`;
        if (extraHeader) header.appendChild(extraHeader);
        panel.appendChild(header); panel.appendChild(contentDOM);
        return panel;
    }

    function createListDOM(items) {
        const ul = document.createElement('ul'); ul.className = 'result-list';
        items.forEach(t => {
            const li = document.createElement('li');
            const span = document.createElement('span'); span.textContent = t; span.style.whiteSpace = 'pre-wrap';
            li.appendChild(span);
            
            const actions = document.createElement('div'); actions.className = 'action-group';
            actions.appendChild(createActionBtn('refine', span));
            actions.appendChild(createActionBtn('copy', t));
            li.appendChild(actions);
            ul.appendChild(li);
        });
        return ul;
    }

    function createTextDOM(text) {
        const div = document.createElement('div'); div.className = 'desc-content';
        const span = document.createElement('span'); span.textContent = text;
        div.appendChild(span);
        
        const actions = document.createElement('div'); actions.className = 'action-group'; actions.style.position = 'absolute'; actions.style.top = '10px'; actions.style.right = '10px';
        actions.appendChild(createActionBtn('refine', span));
        actions.appendChild(createActionBtn('copy', text));
        div.appendChild(actions);
        return div;
    }

    function createActionBtn(type, target) {
        const btn = document.createElement('button');
        btn.className = type === 'copy' ? 'copy-icon-btn' : 'refine-icon-btn';
        btn.innerHTML = type === 'copy' ? '📋' : '✨';
        btn.title = type === 'copy' ? 'Copy to clipboard' : 'Refine with AI';
        
        btn.onclick = () => {
            if (type === 'copy') {
                navigator.clipboard.writeText(typeof target === 'string' ? target : target.textContent);
                btn.innerHTML = '✅'; setTimeout(() => btn.innerHTML = '📋', 2000);
            } else {
                itemBeingRefined = target; // Target is the DOM element (span) containing text
                document.getElementById('refineModal').classList.remove('hidden');
            }
        };
        return btn;
    }

    // Refine Logic
    document.getElementById('closeRefine').onclick = () => document.getElementById('refineModal').classList.add('hidden');
    document.getElementById('refineSubmitBtn').onclick = async () => {
        const instruction = document.getElementById('refineInstruction').value;
        if (!instruction || !itemBeingRefined) return;
        
        const btn = document.getElementById('refineSubmitBtn');
        btn.textContent = 'Refining...'; btn.disabled = true;

        try {
            const textToRefine = itemBeingRefined.textContent;
            const prompt = `Rewrite this content based on the instruction: "${instruction}". \n\nOriginal Text: "${textToRefine}"\n\nReturn ONLY the rewritten text, nothing else.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                if (response.status === 503) throw new Error("Google's servers are temporarily overloaded (503).");
                throw new Error(`API Error ${response.status}`);
            }

            const data = await response.json();
            if (data.candidates) {
                itemBeingRefined.textContent = data.candidates[0].content.parts[0].text.trim();
                document.getElementById('refineModal').classList.add('hidden');
                document.getElementById('refineInstruction').value = '';
            }
        } catch (e) {
            console.error("Refine Error:", e); 
            alert(`Failed to refine: ${e.message}`);
        } finally {
            btn.textContent = 'Refine Now'; btn.disabled = false;
        }
    };

    // History Logic
    const historyModal = document.getElementById('historyModal');
    document.getElementById('historyBtn').onclick = () => {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        const history = JSON.parse(localStorage.getItem('repurpose_history') || '[]');
        
        if (history.length === 0) historyList.innerHTML = '<p>No history found.</p>';
        
        history.forEach((item, index) => {
            const div = document.createElement('div'); div.className = 'history-item';
            div.innerHTML = `<h4>${item.platform.toUpperCase()}</h4><p>${new Date(item.timestamp).toLocaleString()}</p>`;
            div.onclick = () => {
                currentPlatform = item.platform;
                currentGenerationResult = item;
                renderOutput(item.data, item.platform);
                historyModal.classList.add('hidden');
                // Auto navigate to generator view
                homeSelection.classList.remove('active-section'); homeSelection.classList.add('hidden-section');
                generatorArea.classList.remove('hidden-section'); generatorArea.classList.add('active-section');
                mainContainer.className = platformData[item.platform].isWide ? 'container' : 'container narrow';
            };
            historyList.appendChild(div);
        });
        historyModal.classList.remove('hidden');
    };
    document.getElementById('closeHistory').onclick = () => historyModal.classList.add('hidden');

    function saveToHistory(item) {
        let history = JSON.parse(localStorage.getItem('repurpose_history') || '[]');
        history.unshift(item); // Add to top
        if (history.length > 10) history.pop(); // Keep last 10
        localStorage.setItem('repurpose_history', JSON.stringify(history));
    }

    // Export Logic
    document.getElementById('exportPdfBtn').onclick = () => {
        window.print();
    };

    document.getElementById('exportCsvBtn').onclick = () => {
        if (!currentGenerationResult) return;
        const res = currentGenerationResult.data;
        let csv = 'Platform,Type,Content\n';
        
        const parsePlatformData = (platName, data) => {
            if(data.titles) data.titles.forEach(t => csv += `"${platName}","Title","${t.replace(/"/g, '""')}"\n`);
            if(data.description_hook) csv += `"${platName}","Hook","${data.description_hook.replace(/"/g, '""')}"\n`;
            if(data.script_outline) data.script_outline.forEach(s => csv += `"${platName}","Script","${s.replace(/"/g, '""')}"\n`);
            if(data.captions) data.captions.forEach(c => csv += `"${platName}","Caption","${c.replace(/"/g, '""')}"\n`);
            if(data.posts) data.posts.forEach(p => csv += `"${platName}","Post","${p.replace(/"/g, '""')}"\n`);
            if(data.tweets) data.tweets.forEach(t => csv += `"${platName}","Tweet","${t.replace(/"/g, '""')}"\n`);
            if(data.image_prompt) csv += `"${platName}","Image Prompt","${data.image_prompt.replace(/"/g, '""')}"\n`;
            if(data.tags) csv += `"${platName}","Tags","${data.tags.join(' ')}"\n`;
            if(data.hashtags) csv += `"${platName}","Hashtags","${data.hashtags.join(' ')}"\n`;
        };

        if (currentGenerationResult.platform === 'omni') {
            if(res.youtube) parsePlatformData('YouTube', res.youtube);
            if(res.tiktok) parsePlatformData('TikTok', res.tiktok);
            if(res.instagram) parsePlatformData('Instagram', res.instagram);
            if(res.linkedin) parsePlatformData('LinkedIn', res.linkedin);
            if(res.twitter) parsePlatformData('Twitter', res.twitter);
        } else {
            parsePlatformData(currentGenerationResult.platform, res);
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'RePurpose_Strategy.csv';
        a.click(); window.URL.revokeObjectURL(url);
    };
});
