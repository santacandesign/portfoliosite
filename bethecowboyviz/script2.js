const parseTime = d3.timeParse("%M:%S");

const margin = { top: 30, right: 40, bottom: 60, left: 60 },
  width = 500 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

d3.select(".tooltip").remove();
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const songScores = [];

d3.json("data.json")
  .then(function (data) {
    data.forEach((d) => {
      d.songName = d["Name of the song"].trim();
      d.parsedTime = parseTime(d.timestamp);
    });

    const songs = d3.group(data, (d) => d.songName);
    const container = d3.select("#charts-container");

    songs.forEach((songData, songName) => {
      const diaryEntryObj = songData.find(
        (d) => d["diary entry"] && d["diary entry"].trim() !== "",
      );
      const diaryText = diaryEntryObj
        ? diaryEntryObj["diary entry"]
        : "No diary entry available.";

      const n = songData.length;
      const rawImpactSum = d3.sum(
        songData,
        (d) => d["musical colour"] * d["intensity of emotional response"],
      );
      const impactScore = rawImpactSum / n;

      const avgIntensity = d3.mean(
        songData,
        (d) => d["intensity of emotional response"],
      );
      const volatility = Math.sqrt(
        d3.mean(
          songData.map((d) =>
            Math.pow(d["intensity of emotional response"] - avgIntensity, 2),
          ),
        ),
      );

      songScores.push({ songName, impact: impactScore, volatility });

      // 1. Layout Wrappers
      const sectionWrapper = container
        .append("div")
        .attr("class", "chart-wrapper");
      sectionWrapper
        .append("h3")
        .attr("class", "song-title")
        .text("♪ " + songName);
      const contentRow = sectionWrapper
        .append("div")
        .attr("class", "content-row");
      const chartCol = contentRow.append("div").attr("class", "chart-column");
      contentRow
        .append("div")
        .attr("class", "diary-container")
        .html(
          `<strong>My thoughts</strong><br>${diaryText}<br><br><strong>${impactScore.toFixed(2)}</strong><br>Impact score - Σ [(musical richness)*(emotional intensity)]/n <br><br><strong>${volatility.toFixed(2)}</strong><br>Deviation in range of emotions - <br> σ = √ (Σ (emotion intensity - emotional intensity mean)² /n)`,
        );

      const statsContainer = contentRow
        .append("div")
        .attr("class", "stats-sidebar");

      // 2. SVG Setup
      const svg = chartCol
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
        )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("responsive-svg", true)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // 3. Filters (Defs)
      const defs = svg.append("defs");

      // Line Texture
      const filter = defs.append("filter").attr("id", "line-texture");
      filter
        .append("feTurbulence")
        .attr("type", "turbulence")
        .attr("baseFrequency", "0.6")
        .attr("numOctaves", "10")
        .attr("result", "turb");
      filter
        .append("feDisplacementMap")
        .attr("in", "SourceGraphic")
        .attr("in2", "turb")
        .attr("scale", "4");

      // Glow
      const glowFilter = defs.append("filter").attr("id", "glow");
      glowFilter
        .append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "blur");
      const feMerge = glowFilter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "blur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // Dot Texture
      const dotfilter = defs.append("filter").attr("id", "dot-texture");
      dotfilter
        .append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", "0.8")
        .attr("numOctaves", "2");
      dotfilter
        .append("feDisplacementMap")
        .attr("in", "SourceGraphic")
        .attr("scale", "3");

      // 4. Scales & Axes
      const x = d3
        .scaleTime()
        .domain(d3.extent(songData, (d) => d.parsedTime))
        .range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([-0.2, 2.2])
        .range([height - 15, 15]);

      const bridgeLine = d3
        .line()
        .x((d) => x(d.parsedTime))
        .y((d) => y(d["musical colour"]))
        .curve(d3.curveCatmullRom.alpha(0.5));

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%M:%S")).ticks(5));
      svg.append("g").call(d3.axisLeft(y).ticks(3));
      const widthScale = (d) =>
        d["intensity of emotional response"] * 3 * 2 * 1.1;
      // multiply by 2 because the area expands both above and below the center,
      // so total visual thickness = the dot's diameter

      const area = d3
        .area()
        .x((d) => x(d.parsedTime))
        .y0((d) => y(d["musical colour"]) - widthScale(d) / 1.6)
        .y1((d) => y(d["musical colour"]) + widthScale(d) / 1.6)
        .curve(d3.curveCatmullRom.alpha(0.3));

      // 5. Drawing Elements
      // The Path
      svg
        .append("path")
        .datum(songData)
        .attr("fill", "#e9dfa7ff")
        .attr("stroke", "#e9dfa7ff")
        .attr("stroke-width", (d) => {
          return 5;
        })
        .attr("filter", "url(#line-texture) url(#glow)")
        .attr("d", area);

      const dotSize = { 1: 6, 2: 10, 3: 13 };
      const dotStroke = { 1: 4, 2: 6, 3: 8 };

      // The Halos
      svg
        .selectAll(".dot-halo-bg")
        .data(songData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.parsedTime))
        .attr("cy", (d) => y(d["musical colour"]))
        .attr("r", (d) => dotSize[d["intensity of emotional response"]] * 1.2)
        .attr("fill", "#FAF1BE")
        .attr("filter", "url(#dot-texture)");

      svg
        .selectAll(".dot-halo-red")
        .data(songData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.parsedTime))
        .attr("cy", (d) => y(d["musical colour"]))
        .attr("r", (d) => dotSize[d["intensity of emotional response"]] * 1)
        .attr("fill", "#cb4538ff")
        .attr("filter", "url(#dot-texture)");

      // The Main Dots
      svg
        .selectAll(".dot-inner")
        .data(songData)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.parsedTime))
        .attr("cy", (d) => y(d["musical colour"]))
        .attr("r", (d) => dotSize[d["intensity of emotional response"]] * 0.5)
        .attr("fill", "#FFA671")
        .style("paint-order", "stroke fill")
        .attr("filter", "url(#dot-texture)");

      // X-Axis Label: Time
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("fill", "#cc9985")
        .style("font-size", "12px")
        // .style("font-style", "italic")
        .style("font-family", "Libre, serif")
        .text("Song timestamp (mins) →");

      // Y-Axis Label: Resonance
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -30)
        .attr("fill", "#cc9985")
        .style("font-size", "12px")
        // .style("font-style", "italic")
        .style("font-family", "Libre, serif")
        .text("Musical richness →");

      // 6. Tracker Line (Continuous)
      const trackerLine = svg
        .append("line")
        .attr("class", "tracker-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#CC9985")
        .style("stroke-width", "1px")
        // .style("stroke-dasharray", "4,4")
        .style("opacity", 0)
        .style("pointer-events", "none");

      // 7. Interaction Overlay (Must be LAST)
      const bisectDate = d3.bisector((d) => d.parsedTime).left;

      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", () => trackerLine.style("opacity", 1))
        .on("mouseout", () => {
          trackerLine.style("opacity", 0);
          tooltip.style("opacity", 0);
        })
        .on("mousemove", function (event) {
          const mouseX = d3.pointer(event)[0];

          // Move line continuously
          trackerLine.attr("x1", mouseX).attr("x2", mouseX);

          // Find closest data point
          const x0 = x.invert(mouseX);
          const i = bisectDate(songData, x0, 1);
          const d0 = songData[i - 1];
          const d1 = songData[i];
          if (!d0 || !d1) return;
          const d = x0 - d0.parsedTime > d1.parsedTime - x0 ? d1 : d0;

          // Check distance for tooltip snapping (25px threshold)
          const distance = Math.abs(mouseX - x(d.parsedTime));
          if (distance < 25) {
            tooltip.transition().duration(50).style("opacity", 1);
            tooltip
              .html(
                `
                <div margin-bottom: 4px;"></div>
                Time : ${d.timestamp} mins<br>
                Musical richness : ${d["musical colour"]}<br>
                Emotional Intensity : ${d["intensity of emotional response"]}
            `,
              )
              .style("left", event.pageX + 15 + "px")
              .style("top", event.pageY - 28 + "px");
          } else {
            tooltip.style("opacity", 0);
          }
        });
    });
    // FINAL STEP: Draw the summary table after all charts are done
    createStatsTable(songScores);
    createGlobalNavigator(data);
    window.addEventListener("scroll", () => {
      const wrappers = document.querySelectorAll(".chart-wrapper");
      const navSegments = d3.selectAll(".nav-segment");
      const songsArray = d3.groups(data, (d) => d.songName); // Ensure we have the array
      const navXScale = d3
        .scaleLinear()
        .domain([0, data.length])
        .range([0, window.innerWidth - 72]);
      let totalPassedPoints = 0;

      let currentSongIndex = -1;

      // 1. Determine which song is currently in view
      wrappers.forEach((wrapper, index) => {
        const rect = wrapper.getBoundingClientRect();
        // If the top of the section has passed the middle of the screen
        if (rect.top < window.innerHeight / 2) {
          totalPassedPoints = d3.sum(
            songsArray.slice(0, index + 1),
            (d) => d[1].length,
          );
        }
      });

      d3.select("#nav-clip rect")
        .transition()
        .duration(400)
        .attr("width", navXScale(totalPassedPoints));

      d3.selectAll(".nav-segment").each(function (d, i) {
        d3.select(this).classed("past", i <= currentSongIndex);
      });

      // 2. Update the Navigator segments
      navSegments.each(function (d, i) {
        const segment = d3.select(this);
        if (i <= currentSongIndex) {
          segment.classed("past", true);
        } else {
          // It's a "future" song
          segment.classed("past", false);
        }
      });
    });
  })

  .catch((err) => console.error("Error:", err));

function createStatsTable(data) {
  // 1. Sort by highest Impact Score
  data.sort((a, b) => b.impact - a.impact);

  const tableWrapper = d3
    .select("#leaderboard-container")
    .append("div")
    .attr("class", "table-wrapper");
  tableWrapper
    .append("h2")
    .attr("class", "summary-title")
    .text("Song metric leaderboard");

  const table = tableWrapper.append("table").attr("class", "stats-table");
  table.append("thead").append("tr").html(`
    <th>Song Name</th>
    <th>Impact Score</th>
    <th>Deviation in range of emotions</th>
  `);

  const tbody = table.append("tbody");

  // 2. Add the star logic in the loop
  data.forEach((d, i) => {
    // Check if it's one of the top two (index 0 or 1)
    const star = i < 2 ? `<span class="top-star">★ </span>` : "";

    // Assign a class "top-tier" to the first two rows
    const rowClass = i < 2 ? 'class="top-tier"' : "";

    tbody.append("tr").attr("class", i < 2 ? "top-tier" : "").html(`
      <td>${star}${d.songName}</td>
      <td>${d.impact.toFixed(3)}</td>
      <td>${d.volatility.toFixed(3)}</td>
    `);
  });
}

function createGlobalNavigator(allData) {
  const navHeight = 60;
  const navWidth = window.innerWidth - 72;

  // 1. Setup the container
  let navContainer = d3.select("#global-nav-bar");
  if (navContainer.empty()) {
    navContainer = d3.select("body").append("div").attr("id", "global-nav-bar");
  }
  navContainer.selectAll("*").remove();

  const svg = navContainer
    .append("svg")
    .attr("width", navWidth)
    .attr("height", navHeight)
    .attr("preserveAspectRatio", "none")
    .style("overflow", "visible");

  const defs = svg.append("defs");

  // Line Texture
  const navLine = defs.append("filter").attr("id", "nav-line-texture");
  navLine
    .append("feTurbulence")
    .attr("type", "turbulence")
    .attr("baseFrequency", "0.6")
    .attr("numOctaves", "8")
    .attr("result", "turb");
  navLine
    .append("feDisplacementMap")
    .attr("in", "SourceGraphic")
    .attr("in2", "turb")
    .attr("scale", "2");

  const clipRect = defs
    .append("clipPath")
    .attr("id", "nav-clip")
    .append("rect")
    .attr("width", 4)
    .attr("height", navHeight);

  // --- 1. DEFINE THE GLOW FILTER ---
  const filter = defs.append("filter").attr("id", "nav-glow");
  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "3")
    .attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const songs = d3.groups(allData, (d) => d.songName);
  let progressPoints = 0;
  const totalPoints = allData.length;

  // Scales
  const x = d3.scaleLinear().domain([0, totalPoints]).range([0, navWidth]);
  const y = d3
    .scaleLinear()
    .domain([-0.2, 2.2])
    .range([navHeight - 8, 8]);

  // 2. Draw the "Master Line"
  const lineGen = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d["musical colour"]))
    .curve(d3.curveMonotoneX);

  // --- 2. DRAW THE GHOST MASTER LINE (Background) ---
  svg
    .append("path")
    .datum(allData)
    .attr("d", lineGen)
    .attr("fill", "none")
    .attr("stroke", "#442a2cff")
    .attr("stroke-width", 2)
    .style("opacity", 1); // Faded background

  //past path (jesus fk, what a nightmare)
  svg
    .append("path")
    .datum(allData)
    .attr("d", lineGen)
    .attr("fill", "none")
    .attr("stroke", "#cc9985") // Same stroke for the whole line
    .attr("stroke-width", 4)
    .attr("filter", "url(#nav-line-texture)")
    .attr("clip-path", "url(#nav-clip)");

  // ... existing scale and master line code ...

  // 1. Create a group for the "Badge" (Label + Background)
  const badgeGroup = svg
    .append("g")
    .attr("class", "nav-badge")
    .style("opacity", 0)
    .style("pointer-events", "none");

  // 2. Add the background rectangle (Stroke and Rounded Corners)
  const badgeBg = badgeGroup
    .append("rect")
    .attr("class", "badge-bg")
    .attr("rx", 6) // Rounded corners
    .attr("ry", 6)
    .attr("fill", "#392324") // Your diary background color
    .attr("stroke", "#cc998533") // Your rose stroke color
    .attr("stroke-width", 1);

  // 3. Add the text
  const badgeText = badgeGroup
    .append("text")
    .attr("class", "badge-text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") // Vertical alignment
    .style("fill", "#cc9985")
    .style("font-family", "'Libre italic', serif")
    .style("font-size", "14px");

  // 4. Update the hit-box loop
  let offset = 0;
  songs.forEach(([name, sData], i) => {
    const segmentGroup = svg
      .append("g")
      .attr("class", "nav-segment")
      .attr("id", `nav-seg-${i}`);

    // The individual path for this song
    segmentGroup
      .append("path")
      .datum(sData)
      .attr(
        "d",
        d3
          .line()
          .x((d, j) => x(offset + j))
          .y((d) => y(d["musical colour"]))
          .curve(d3.curveMonotoneX),
      )
      .attr("fill", "none");

    const segmentWidth = x(offset + sData.length) - x(offset);
    const centerX = x(offset) + segmentWidth / 2;

    const highlightPath = svg
      .append("path")
      .datum(sData)
      .attr("class", `nav-path-${i}`)
      .attr(
        "d",
        d3
          .line()
          .x((d, j) => x(offset + j))
          .y((d) => y(d["musical colour"]))
          .curve(d3.curveMonotoneX),
      )
      .attr("fill", "none")
      .style("opacity", 1);

    svg
      .append("rect")
      .attr("x", x(offset))
      .attr("y", 0)
      .attr("width", segmentWidth)
      .attr("height", navHeight)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseover", function () {
        // Set the text first
        badgeText.text("♪ " + name);

        // Measure text to resize background
        const bbox = badgeText.node().getBBox();
        const padding = 12;

        badgeBg
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding / 2)
          .attr("width", bbox.width + padding * 2)
          .attr("height", bbox.height + padding);

        // Move group and show it
        badgeGroup
          .attr("transform", `translate(${centerX}, -25)`)
          .transition()
          .duration(200)
          .style("opacity", 1);

        // 2. Glow & Change Line Colour
        highlightPath
          .transition()
          .duration(200)
          .attr("stroke", "#FAF1BE")
          .attr("stroke-width", 4)
          .style("opacity", 1)
          .style("filter", "url(#nav-glow)");
      })
      .on("mouseout", () => {
        badgeGroup.transition().duration(200).style("opacity", 0);
        highlightPath
          .transition()
          .duration(200)
          .attr("stroke", "#392324")
          .attr("stroke-width", 2)
          .style("opacity", 0)
          .style("filter", "none");
      })
      .on("click", () => {
        document
          .querySelectorAll(".chart-wrapper")
          [i].scrollIntoView({ behavior: "smooth" });
      });

    offset += sData.length;
  });
}
