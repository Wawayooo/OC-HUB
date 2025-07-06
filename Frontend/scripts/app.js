const ADMIN_PASSWORD = "adminpass";
const OFFICES = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Auditor",
  "Public Relations Officer",
];

let currentPhase = "nomination";
let isAdminLoggedIn = false;

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  updateDisplay();
});

function initializeApp() {
  if (!localStorage.getItem("club_state")) {
    localStorage.setItem(
      "club_state",
      JSON.stringify({
        phase: "nomination",
        totalEligibleVoters: 50,
        startTime: new Date().toISOString(),
      })
    );
  }

  if (!localStorage.getItem("club_nominees")) {
    localStorage.setItem("club_nominees", JSON.stringify({}));
  }

  if (!localStorage.getItem("club_ballots")) {
    localStorage.setItem("club_ballots", JSON.stringify({}));
  }

  if (!localStorage.getItem("club_votes_log")) {
    localStorage.setItem("club_votes_log", JSON.stringify([]));
  }

  const state = JSON.parse(localStorage.getItem("club_state"));
  currentPhase = state.phase;

  showSection("nomination");
}

function setupEventListeners() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      showSection(section);
    });
  });

  document
    .getElementById("nomination-form")
    .addEventListener("submit", handleNominationSubmit);
  document
    .getElementById("voting-form")
    .addEventListener("submit", handleVotingSubmit);
  document
    .getElementById("admin-login-form")
    .addEventListener("submit", handleAdminLogin);

  document.addEventListener("keydown", handleKeyboardNavigation);
}

function handleKeyboardNavigation(event) {
  if (event.altKey) {
    const keyMap = {
      1: "nomination",
      2: "campaign",
      3: "voting",
      4: "results",
      5: "admin",
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      showSection(keyMap[event.key]);
    }
  }
}

function showSection(sectionName) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionName + "-section").classList.add("active");

  // Update navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`[data-section="${sectionName}"]`)
    .classList.add("active");

  // Update section content
  updateSectionContent(sectionName);
}

/**
 * Update section content based on current phase
 */
function updateSectionContent(sectionName) {
  const state = JSON.parse(localStorage.getItem("club_state"));

  switch (sectionName) {
    case "nomination":
      updateNominationSection();
      break;
    case "campaign":
      updateCampaignSection();
      break;
    case "voting":
      updateVotingSection();
      break;
    case "results":
      updateResultsSection();
      break;
    case "admin":
      updateAdminSection();
      break;
  }
}

/**
 * Update the display based on current state
 */
function updateDisplay() {
  const state = JSON.parse(localStorage.getItem("club_state"));
  currentPhase = state.phase;

  // Update phase indicator
  document.getElementById("current-phase").textContent =
    currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1) + " Phase";

  // Update all sections
  updateNominationSection();
  updateCampaignSection();
  updateVotingSection();
  updateResultsSection();
  updateAdminSection();
}

/**
 * Handle nomination form submission
 */
function handleNominationSubmit(event) {
  event.preventDefault();

  const state = JSON.parse(localStorage.getItem("club_state"));
  if (state.phase !== "nomination") {
    showToast("Nomination phase is not active", "error");
    return;
  }

  const formData = new FormData(event.target);
  const nomination = {
    name: formData.get("nominee-name").trim(),
    office: formData.get("nominee-office"),
    platform: formData.get("nominee-platform").trim(),
    timestamp: new Date().toISOString(),
  };

  // Validate input
  if (!nomination.name || !nomination.office || !nomination.platform) {
    showToast("Please fill in all fields", "error");
    return;
  }

  if (nomination.platform.length > 500) {
    showToast("Platform must be 500 characters or less", "error");
    return;
  }

  // Check for duplicate nominations
  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  if (!nominees[nomination.office]) {
    nominees[nomination.office] = [];
  }

  const existingNominee = nominees[nomination.office].find(
    (n) => n.name.toLowerCase() === nomination.name.toLowerCase()
  );

  if (existingNominee) {
    showToast("This person is already nominated for this office", "error");
    return;
  }

  // Add nomination
  nominees[nomination.office].push(nomination);
  localStorage.setItem("club_nominees", JSON.stringify(nominees));

  // Reset form
  event.target.reset();

  // Update display
  updateNominationSection();
  showToast("Nomination submitted successfully", "success");
}

/**
 * Update nomination section
 */
function updateNominationSection() {
  const state = JSON.parse(localStorage.getItem("club_state"));
  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const display = document.getElementById("nominees-display");

  // Check if nomination is active
  const form = document.getElementById("nomination-form");
  const submitBtn = form.querySelector('button[type="submit"]');

  if (state.phase !== "nomination") {
    submitBtn.disabled = true;
    submitBtn.textContent = "Nomination Phase Closed";
    form.style.opacity = "0.6";
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Nomination";
    form.style.opacity = "1";
  }

  // Display nominees
  display.innerHTML = "";

  if (Object.keys(nominees).length === 0) {
    display.innerHTML = "<p>No nominations yet. Be the first to nominate!</p>";
    return;
  }

  OFFICES.forEach((office) => {
    if (nominees[office] && nominees[office].length > 0) {
      const officeDiv = document.createElement("div");
      officeDiv.className = "office-nominees";
      officeDiv.innerHTML = `
                <h4>${office}</h4>
                ${nominees[office]
                  .map(
                    (nominee) => `
                    <div class="nominee-card">
                        <h5>${escapeHtml(nominee.name)}</h5>
                        <div class="office">${escapeHtml(nominee.office)}</div>
                        <div class="platform">${escapeHtml(
                          nominee.platform
                        )}</div>
                    </div>
                `
                  )
                  .join("")}
            `;
      display.appendChild(officeDiv);
    }
  });
}

/**
 * Update campaign section
 */
function updateCampaignSection() {
  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const display = document.getElementById("campaign-display");

  display.innerHTML = "";

  if (Object.keys(nominees).length === 0) {
    display.innerHTML = "<p>No candidates available for campaign viewing.</p>";
    return;
  }

  OFFICES.forEach((office) => {
    if (nominees[office] && nominees[office].length > 0) {
      const officeDiv = document.createElement("div");
      officeDiv.className = "office-candidates";
      officeDiv.innerHTML = `
                <h3>${office}</h3>
                <div class="candidate-cards">
                    ${nominees[office]
                      .map(
                        (candidate) => `
                        <div class="candidate-card">
                            <h4>${escapeHtml(candidate.name)}</h4>
                            <div class="platform">${escapeHtml(
                              candidate.platform
                            )}</div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
      display.appendChild(officeDiv);
    }
  });
}

/**
 * Update voting section
 */
function updateVotingSection() {
  const state = JSON.parse(localStorage.getItem("club_state"));
  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const ballot = document.getElementById("voting-ballot");
  const form = document.getElementById("voting-form");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Check if voting is active
  if (state.phase !== "voting") {
    submitBtn.disabled = true;
    submitBtn.textContent = "Voting Phase Not Active";
    form.style.opacity = "0.6";
    ballot.innerHTML = "<p>Voting is not currently active.</p>";
    return;
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Vote";
    form.style.opacity = "1";
  }

  // Generate ballot
  ballot.innerHTML = "";

  if (Object.keys(nominees).length === 0) {
    ballot.innerHTML = "<p>No candidates available for voting.</p>";
    return;
  }

  OFFICES.forEach((office) => {
    if (nominees[office] && nominees[office].length > 0) {
      const officeDiv = document.createElement("div");
      officeDiv.className = "office-ballot";
      officeDiv.innerHTML = `
                <h4>${office}</h4>
                <div class="candidate-options">
                    ${nominees[office]
                      .map(
                        (candidate, index) => `
                        <div class="candidate-option">
                            <input type="radio" id="${office}-${index}" name="${office}" value="${escapeHtml(
                          candidate.name
                        )}" aria-describedby="${office}-${index}-label">
                            <label for="${office}-${index}" id="${office}-${index}-label">${escapeHtml(
                          candidate.name
                        )}</label>
                        </div>
                    `
                      )
                      .join("")}
                    <div class="candidate-option">
                        <input type="radio" id="${office}-abstain" name="${office}" value="ABSTAIN" aria-describedby="${office}-abstain-label">
                        <label for="${office}-abstain" id="${office}-abstain-label">Abstain</label>
                    </div>
                </div>
            `;
      ballot.appendChild(officeDiv);
    }
  });
}

/**
 * Handle voting form submission
 */
function handleVotingSubmit(event) {
  event.preventDefault();

  const state = JSON.parse(localStorage.getItem("club_state"));
  if (state.phase !== "voting") {
    showToast("Voting phase is not active", "error");
    return;
  }

  const formData = new FormData(event.target);
  const studentId = formData.get("student-id").trim();

  if (!studentId) {
    showToast("Please enter your Student ID", "error");
    return;
  }

  // Hash student ID for privacy
  const hashedId = simpleHash(studentId);

  // Check if already voted
  const ballots = JSON.parse(localStorage.getItem("club_ballots"));
  if (ballots[hashedId]) {
    showToast("This Student ID has already voted", "error");
    return;
  }

  // Collect votes
  const votes = {};
  OFFICES.forEach((office) => {
    const vote = formData.get(office);
    if (vote) {
      votes[office] = vote;
    }
  });

  if (Object.keys(votes).length === 0) {
    showToast("Please select at least one candidate or abstain", "error");
    return;
  }

  // Save ballot
  ballots[hashedId] = votes;
  localStorage.setItem("club_ballots", JSON.stringify(ballots));

  // Save to votes log for export
  const votesLog = JSON.parse(localStorage.getItem("club_votes_log"));
  votesLog.push({
    timestamp: new Date().toISOString(),
    votes: votes,
  });
  localStorage.setItem("club_votes_log", JSON.stringify(votesLog));

  // Reset form
  event.target.reset();

  showToast("Vote submitted successfully", "success");
}

/**
 * Update results section
 */
function updateResultsSection() {
  const state = JSON.parse(localStorage.getItem("club_state"));
  const display = document.getElementById("results-display");

  if (state.phase !== "closed") {
    display.innerHTML = "<p>Results will be available after voting closes.</p>";
    return;
  }

  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const ballots = JSON.parse(localStorage.getItem("club_ballots"));
  const results = calculateResults(nominees, ballots);

  // Display turnout
  const totalVotes = Object.keys(ballots).length;
  const turnoutHtml = `
        <div class="turnout-stats">
            ${totalVotes} out of ${
    state.totalEligibleVoters
  } students voted – ${Math.round(
    (totalVotes / state.totalEligibleVoters) * 100
  )}% turnout
        </div>
    `;

  // Display results
  let resultsHtml = turnoutHtml;

  OFFICES.forEach((office) => {
    if (results[office]) {
      const officeResults = results[office];
      const maxVotes = Math.max(...Object.values(officeResults));
      const winners = Object.keys(officeResults).filter(
        (name) => officeResults[name] === maxVotes
      );

      resultsHtml += `
                <div class="office-results">
                    <h3>${office}</h3>
                    ${
                      winners.length === 1
                        ? `<div class="winner">🏆 Winner: ${escapeHtml(
                            winners[0]
                          )} (${maxVotes} votes)</div>`
                        : `<div class="tie">🤝 Tie between: ${winners
                            .map((w) => escapeHtml(w))
                            .join(", ")} (${maxVotes} votes each)</div>`
                    }
                    <div class="vote-counts">
                        ${Object.entries(officeResults)
                          .sort(([, a], [, b]) => b - a)
                          .map(
                            ([name, count]) => `
                                <div class="vote-count">
                                    <span>${escapeHtml(name)}</span>
                                    <span><strong>${count} votes</strong></span>
                                </div>
                            `
                          )
                          .join("")}
                    </div>
                </div>
            `;
    }
  });

  display.innerHTML = resultsHtml;

  // Draw chart
  setTimeout(() => drawResultsChart(results), 100);
}

/**
 * Calculate election results
 */
function calculateResults(nominees, ballots) {
  const results = {};

  // Initialize results
  OFFICES.forEach((office) => {
    if (nominees[office] && nominees[office].length > 0) {
      results[office] = {};
      nominees[office].forEach((nominee) => {
        results[office][nominee.name] = 0;
      });
      results[office]["ABSTAIN"] = 0;
    }
  });

  // Count votes
  Object.values(ballots).forEach((ballot) => {
    Object.entries(ballot).forEach(([office, candidate]) => {
      if (results[office] && results[office].hasOwnProperty(candidate)) {
        results[office][candidate]++;
      }
    });
  });

  return results;
}

/**
 * Draw results chart using Canvas
 */
function drawResultsChart(results) {
  const canvas = document.getElementById("results-chart");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 800;
  canvas.height = 400;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chart configuration
  const margin = { top: 20, right: 20, bottom: 60, left: 100 };
  const chartWidth = canvas.width - margin.left - margin.right;
  const chartHeight = canvas.height - margin.top - margin.bottom;

  // Prepare data
  const chartData = [];
  Object.entries(results).forEach(([office, candidates]) => {
    Object.entries(candidates).forEach(([name, votes]) => {
      if (name !== "ABSTAIN") {
        chartData.push({ office, name, votes });
      }
    });
  });

  if (chartData.length === 0) {
    ctx.fillStyle = "#666";
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("No data to display", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Find max votes for scaling
  const maxVotes = Math.max(...chartData.map((d) => d.votes));

  // Draw bars
  const barHeight = chartHeight / chartData.length;
  const colors = [
    "#18BC9C",
    "#2C3E50",
    "#3498DB",
    "#E74C3C",
    "#F39C12",
    "#9B59B6",
  ];

  chartData.forEach((data, index) => {
    const barWidth = (data.votes / maxVotes) * chartWidth;
    const y = margin.top + index * barHeight;

    // Draw bar
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(margin.left, y, barWidth, barHeight - 2);

    // Draw label
    ctx.fillStyle = "#2C3E50";
    ctx.font = "12px system-ui";
    ctx.textAlign = "right";
    ctx.fillText(
      `${data.name} (${data.office})`,
      margin.left - 10,
      y + barHeight / 2 + 4
    );

    // Draw vote count
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(`${data.votes}`, margin.left + 5, y + barHeight / 2 + 4);
  });

  // Draw title
  ctx.fillStyle = "#2C3E50";
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Election Results", canvas.width / 2, 16);
}

/**
 * Handle admin login
 */
function handleAdminLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const password = formData.get("admin-password");

  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById("admin-login").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    updateAdminSection();
    showToast("Admin login successful", "success");
  } else {
    showToast("Invalid password", "error");
  }
}

/**
 * Update admin section
 */
function updateAdminSection() {
  if (!isAdminLoggedIn) return;

  const state = JSON.parse(localStorage.getItem("club_state"));
  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const ballots = JSON.parse(localStorage.getItem("club_ballots"));

  // Update eligible voters input
  document.getElementById("total-eligible-voters").value =
    state.totalEligibleVoters;

  // Update stats
  const statsDiv = document.getElementById("admin-stats");
  const totalNominees = Object.values(nominees).reduce(
    (sum, office) => sum + (office ? office.length : 0),
    0
  );
  const totalVotes = Object.keys(ballots).length;

  statsDiv.innerHTML = `
        <h4>Election Statistics</h4>
        <div class="stat-item">
            <span>Current Phase:</span>
            <span><strong>${state.phase}</strong></span>
        </div>
        <div class="stat-item">
            <span>Total Nominees:</span>
            <span><strong>${totalNominees}</strong></span>
        </div>
        <div class="stat-item">
            <span>Total Votes Cast:</span>
            <span><strong>${totalVotes}</strong></span>
        </div>
        <div class="stat-item">
            <span>Voter Turnout:</span>
            <span><strong>${Math.round(
              (totalVotes / state.totalEligibleVoters) * 100
            )}%</strong></span>
        </div>
    `;
}

/**
 * Set election phase
 */
function setPhase(phase) {
  if (!isAdminLoggedIn) {
    showToast("Admin access required", "error");
    return;
  }

  const state = JSON.parse(localStorage.getItem("club_state"));
  state.phase = phase;
  localStorage.setItem("club_state", JSON.stringify(state));

  currentPhase = phase;
  updateDisplay();
  showToast(`Phase set to ${phase}`, "success");
}

/**
 * Update eligible voters count
 */
function updateEligibleVoters() {
  if (!isAdminLoggedIn) {
    showToast("Admin access required", "error");
    return;
  }

  const count = parseInt(
    document.getElementById("total-eligible-voters").value
  );
  if (count < 1) {
    showToast("Total eligible voters must be at least 1", "error");
    return;
  }

  const state = JSON.parse(localStorage.getItem("club_state"));
  state.totalEligibleVoters = count;
  localStorage.setItem("club_state", JSON.stringify(state));

  updateAdminSection();
  showToast("Eligible voters count updated", "success");
}

/**
 * Reset entire election
 */
function resetElection() {
  if (!isAdminLoggedIn) {
    showToast("Admin access required", "error");
    return;
  }

  if (
    !confirm(
      "Are you sure you want to reset the entire election? This will delete all nominations and votes."
    )
  ) {
    return;
  }

  localStorage.setItem(
    "club_state",
    JSON.stringify({
      phase: "nomination",
      totalEligibleVoters: 50,
      startTime: new Date().toISOString(),
    })
  );
  localStorage.setItem("club_nominees", JSON.stringify({}));
  localStorage.setItem("club_ballots", JSON.stringify({}));
  localStorage.setItem("club_votes_log", JSON.stringify([]));

  updateDisplay();
  showToast("Election reset successfully", "success");
}

/**
 * Export results to CSV
 */
function exportCSV() {
  if (!isAdminLoggedIn) {
    showToast("Admin access required", "error");
    return;
  }

  const nominees = JSON.parse(localStorage.getItem("club_nominees"));
  const ballots = JSON.parse(localStorage.getItem("club_ballots"));
  const votesLog = JSON.parse(localStorage.getItem("club_votes_log"));
  const results = calculateResults(nominees, ballots);

  // Create CSV content
  let csvContent = "Office,Candidate,Votes\n";

  Object.entries(results).forEach(([office, candidates]) => {
    Object.entries(candidates).forEach(([name, votes]) => {
      csvContent += `"${office}","${name}",${votes}\n`;
    });
  });

  csvContent += "\n\nDetailed Voting Log\n";
  csvContent += "Timestamp,Office,Vote\n";

  votesLog.forEach((log) => {
    Object.entries(log.votes).forEach(([office, vote]) => {
      csvContent += `"${log.timestamp}","${office}","${vote}"\n`;
    });
  });

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `election_results_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Results exported to CSV", "success");
}

/**
 * Seed demo data for testing
 */
function seedDemo() {
  if (!isAdminLoggedIn) {
    showToast("Admin access required", "error");
    return;
  }

  if (!confirm("This will add demo data to the election. Continue?")) {
    return;
  }

  const demoNames = [
    "Alex Johnson",
    "Sam Wilson",
    "Jordan Lee",
    "Casey Brown",
    "Taylor Davis",
    "Morgan Garcia",
    "Riley Martinez",
    "Avery Rodriguez",
    "Quinn Anderson",
    "Sage Thompson",
    "Blake White",
    "Drew Lopez",
  ];

  const demoPlatforms = [
    "Committed to transparency and student engagement in all decisions.",
    "Focused on improving campus life and student services.",
    "Dedicated to academic excellence and support programs.",
    "Passionate about sustainability and environmental initiatives.",
    "Advocate for student rights and fair representation.",
    "Experienced in leadership and team collaboration.",
    "Committed to financial responsibility and budget transparency.",
    "Focused on community building and inclusive events.",
    "Dedicated to improving communication between students and administration.",
    "Passionate about mental health awareness and support services.",
    "Advocate for diversity, equity, and inclusion initiatives.",
    "Experienced in event planning and student activities.",
  ];

  // Add demo nominees
  const nominees = {};
  OFFICES.forEach((office, officeIndex) => {
    nominees[office] = [];
    for (let i = 0; i < 2; i++) {
      const nameIndex = (officeIndex * 2 + i) % demoNames.length;
      const platformIndex = (officeIndex * 2 + i) % demoPlatforms.length;
      nominees[office].push({
        name: demoNames[nameIndex],
        office: office,
        platform: demoPlatforms[platformIndex],
        timestamp: new Date().toISOString(),
      });
    }
  });

  localStorage.setItem("club_nominees", JSON.stringify(nominees));

  // Add demo votes
  const ballots = {};
  const votesLog = [];

  for (let i = 0; i < 20; i++) {
    const hashedId = simpleHash(`student${i + 1000}`);
    const votes = {};

    OFFICES.forEach((office) => {
      if (nominees[office] && nominees[office].length > 0) {
        // Random vote (90% chance to vote, 10% chance to abstain)
        if (Math.random() < 0.9) {
          const randomIndex = Math.floor(
            Math.random() * nominees[office].length
          );
          votes[office] = nominees[office][randomIndex].name;
        } else {
          votes[office] = "ABSTAIN";
        }
      }
    });

    ballots[hashedId] = votes;
    votesLog.push({
      timestamp: new Date().toISOString(),
      votes: votes,
    });
  }

  localStorage.setItem("club_ballots", JSON.stringify(ballots));
  localStorage.setItem("club_votes_log", JSON.stringify(votesLog));

  updateDisplay();
  showToast("Demo data seeded successfully", "success");
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/**
 * Simple hash function for student IDs
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.setPhase = setPhase;
window.updateEligibleVoters = updateEligibleVoters;
window.resetElection = resetElection;
window.exportCSV = exportCSV;
window.seedDemo = seedDemo;
