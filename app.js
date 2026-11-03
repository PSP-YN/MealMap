(() => {
  "use strict";
  const STORAGE_KEY = "mealmap.records.v1";
  const $ = (id) => document.getElementById(id);
  const state = { records: [], editingId: null, toastTimer: null };
  const number = (value) => Number(value);
  const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
  const formatNumber = (value, digits = 1) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
  const today = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-"); };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const proteinCost = (record) => record.protein > 0 ? record.price / record.protein * 10 : null;
  const sortByDate = (a,b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name);
  function notify(message) {
    const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(state.toastTimer); state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function loadRecords() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      state.records = Array.isArray(saved) ? saved.filter(isValidRecord) : [];
    } catch { state.records = []; }
  }
  function isValidRecord(r) {
    return r && typeof r.id === "string" && typeof r.name === "string" && r.name.trim() &&
      typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
      Number.isFinite(Number(r.price)) && Number(r.price) > 0 &&
      Number.isFinite(Number(r.calories)) && Number(r.calories) >= 0 &&
      Number.isFinite(Number(r.protein)) && Number(r.protein) >= 0;
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records)); return true; }
    catch { notify("Could not save. Browser storage may be full or disabled."); return false; }
  }
  function average(values) { return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null; }
  function median(values) {
    if (!values.length) return null;
    const sorted = [...values].sort((a,b)=>a-b), mid = Math.floor(sorted.length/2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
  }
  function render() { renderMetrics(); renderChart(); renderInsights(); renderTable(); }
  function renderMetrics() {
    const rows = state.records;
    $("recordStatus").textContent = rows.length ? rows.length + (rows.length === 1 ? " saved record" : " saved records") : "No records yet";
    $("mealCount").textContent = rows.length;
    $("avgPrice").textContent = rows.length ? money(average(rows.map(r=>r.price))) : "—";
    $("avgProtein").textContent = rows.length ? formatNumber(average(rows.map(r=>r.protein))) + " g" : "—";
    const values = rows.map(proteinCost).filter(v=>v !== null);
    $("bestValue").textContent = values.length ? money(Math.min(...values)) : "—";
  }
  function renderChart() {
    const host = $("comparisonChart"), rows = [...state.records].sort((a,b)=>a.price-b.price).slice(0,6);
    if (!rows.length) {
      host.innerHTML = '<div class="empty-chart"><span>＋</span><strong>Your comparison will appear here</strong><small>Add at least one meal with its price and protein value.</small></div>'; return;
    }
    const maxPrice = Math.max(...rows.map(r=>r.price),1), maxProtein = Math.max(...rows.map(r=>r.protein),1);
    host.innerHTML = rows.map(r => {
      const priceWidth = r.price/maxPrice*100, proteinWidth = r.protein/maxProtein*100;
      return '<div class="chart-row"><div class="chart-name" title="'+escapeHtml(r.name)+'">'+escapeHtml(r.name)+'</div><div class="chart-bars"><div class="bar-track" title="Price: '+money(r.price)+'"><div class="bar-fill bar-price" style="width:'+priceWidth+'%"></div></div><div class="bar-track" title="Protein: '+formatNumber(r.protein)+' g"><div class="bar-fill bar-protein" style="width:'+proteinWidth+'%"></div></div></div><div class="chart-values">'+money(r.price)+'<br>'+formatNumber(r.protein)+'g</div></div>';
    }).join("");
  }
  function renderInsights() {
    const host = $("insights"), rows = state.records;
    if (!rows.length) {
      host.innerHTML = '<div class="insight-empty"><span>✳</span><p>Insights appear after you add meal records. MealMap only reports patterns supported by your data.</p></div>'; return;
    }
    const prices = rows.map(r=>r.price), proteins = rows.map(r=>r.protein);
    const cheapest = [...rows].sort((a,b)=>a.price-b.price)[0];
    const highestProtein = [...rows].sort((a,b)=>b.protein-a.protein)[0];
    const valueRows = rows.filter(r=>r.protein>0).sort((a,b)=>proteinCost(a)-proteinCost(b));
    const items = [
      '<strong>Price range:</strong> '+money(Math.min(...prices))+' to '+money(Math.max(...prices))+' across '+rows.length+' recorded meal'+(rows.length===1?"":"s")+'.',
      '<strong>Lowest listed price:</strong> '+escapeHtml(cheapest.name)+' at '+money(cheapest.price)+'.',
      '<strong>Highest recorded protein:</strong> '+escapeHtml(highestProtein.name)+' at '+formatNumber(highestProtein.protein)+' g per serving.',
      valueRows.length ? '<strong>Best protein affordability:</strong> '+escapeHtml(valueRows[0].name)+' at '+money(proteinCost(valueRows[0]))+' per 10 g protein.' : '<strong>Protein affordability:</strong> Add a protein value above zero to calculate this metric.',
      '<strong>Median meal price:</strong> '+money(median(prices))+'.'
    ];
    host.innerHTML = items.map(item=>'<div class="insight-item"><span class="insight-bullet"></span><p>'+item+'</p></div>').join("");
  }
  function renderTable() {
    const query = $("mealSearch").value.trim().toLowerCase();
    const rows = [...state.records].sort(sortByDate).filter(r => [r.name,r.category,r.note,r.date].join(" ").toLowerCase().includes(query));
    $("tableCount").textContent = rows.length + (rows.length===1?" record":" records");
    $("tableFooterText").textContent = state.records.length ? "Saved on this device · Export a CSV to back up or move your records." : "Your records are stored locally in this browser.";
    $("clearAll").hidden = state.records.length === 0;
    if (!rows.length) {
      $("mealTableBody").innerHTML = '<tr class="empty-row"><td colspan="7"><div class="table-empty"><span>◌</span><strong>'+(state.records.length?"No matching meals":"No meal records yet")+'</strong><small>'+(state.records.length?"Try a different search term.":"Add a meal using information from a real menu or nutrition source.")+'</small></div></td></tr>'; return;
    }
    $("mealTableBody").innerHTML = rows.map(r => '<tr><td><span class="meal-cell">'+escapeHtml(r.name)+'</span><span class="meal-category">'+escapeHtml(r.category||"Other")+(r.note?" · "+escapeHtml(r.note):"")+'</span></td><td>'+escapeHtml(r.date)+'</td><td class="value-strong">'+money(r.price)+'</td><td>'+formatNumber(r.calories,0)+' kcal</td><td>'+formatNumber(r.protein)+' g</td><td>'+ (proteinCost(r)===null?"—":money(proteinCost(r)))+'</td><td><div class="row-actions"><button class="row-action" data-action="edit" data-id="'+escapeHtml(r.id)+'" type="button">Edit</button><button class="row-action" data-action="delete" data-id="'+escapeHtml(r.id)+'" type="button" aria-label="Delete '+escapeHtml(r.name)+'">Delete</button></div></td></tr>').join("");
  }
  function openForm(record) {
    state.editingId = record?.id || null;
    $("mealFormPanel").hidden = false;
    $("formTitle").textContent = record ? "Edit meal record" : "Record a meal";
    $("saveMeal").textContent = record ? "Save changes" : "Save meal";
    $("mealName").value = record?.name || "";
    $("mealCategory").value = record?.category || "Breakfast";
    $("mealDate").value = record?.date || today();
    $("mealPrice").value = record?.price ?? "";
    $("mealCalories").value = record?.calories ?? "";
    $("mealProtein").value = record?.protein ?? "";
    $("mealNote").value = record?.note || "";
    $("formError").textContent = "";
    $("mealFormPanel").scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>$("mealName").focus(),150);
  }
  function closeForm() { $("mealFormPanel").hidden = true; state.editingId = null; $("mealForm").reset(); $("formError").textContent=""; }
  function validateForm(data) {
    const parsedDate = new Date(data.date + "T00:00:00Z");
    if (!data.date || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0,10) !== data.date) return "Choose a real calendar date.";
    if (!data.name.trim()) return "Enter a meal name.";
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return "Choose a valid date.";
    if (!Number.isFinite(data.price) || data.price <= 0 || data.price > 100000) return "Price must be greater than ₹0 and no more than ₹1,00,000.";
    if (!Number.isFinite(data.calories) || data.calories < 0 || data.calories > 100000) return "Enter a valid calorie value (0 or more).";
    if (!Number.isFinite(data.protein) || data.protein < 0 || data.protein > 10000) return "Enter a valid protein value (0 or more).";
    return "";
  }
  function submitForm(event) {
    event.preventDefault();
    if (!$("mealCalories").value.trim()) { $("formError").textContent = "Enter calories from a reliable source, or a clearly stated estimate."; return; }
    if (!$("mealProtein").value.trim()) { $("formError").textContent = "Enter protein grams from a reliable source, or a clearly stated estimate."; return; }
    const wasEditing = Boolean(state.editingId);
    const data = {name:$("mealName").value.trim(),category:$("mealCategory").value,date:$("mealDate").value,price:number($("mealPrice").value),calories:number($("mealCalories").value),protein:number($("mealProtein").value),note:$("mealNote").value.trim()};
    const error = validateForm(data); if (error) { $("formError").textContent=error; return; }
    if (state.editingId) {
      const index = state.records.findIndex(r=>r.id===state.editingId);
      if (index>=0) state.records[index] = {...state.records[index],...data};
    } else state.records.push({id:crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+"-"+Math.random().toString(16).slice(2),...data,createdAt:new Date().toISOString()});
    if (saveRecords()) { closeForm(); render(); notify(wasEditing?"Meal updated.":"Meal saved."); }
  }
  function deleteRecord(id) {
    const record = state.records.find(r=>r.id===id); if (!record) return;
    if (!confirm('Delete "'+record.name.replace(/"/g,"")+'" from your records?')) return;
    state.records = state.records.filter(r=>r.id!==id); saveRecords(); render(); notify("Meal record deleted.");
  }
  function csvEscape(value) { const s=String(value??""); return /[",\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }
  function download(name, content, type) {
    const blob = new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function exportCsv() {
    if (!state.records.length) { notify("Add at least one meal before exporting."); return; }
    const columns=["date","name","category","price","calories","protein","note"];
    const lines=[columns.join(",")].concat(state.records.slice().sort(sortByDate).map(r=>columns.map(k=>csvEscape(r[k])).join(",")));
    download("mealmap-records-"+today()+".csv",lines.join("\r\n"),"text/csv;charset=utf-8"); notify("CSV export prepared.");
  }
  function parseCsv(text) {
    const rows=[]; let row=[], field="", quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i]; if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}else if(c==='"')quoted=true;else if(c===","){row.push(field);field="";}else if(c==="\n"){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field="";}else field+=c;}
    if(field.length||row.length){row.push(field.replace(/\r$/,""));rows.push(row);} return rows;
  }
  async function importCsv(file) {
    if(!file)return;
    if(file.size>2*1024*1024){notify("CSV must be smaller than 2 MB.");return;}
    try{
      const rows=parseCsv(await file.text()); if(rows.length<2)throw new Error("The CSV has no meal rows.");
      const headers=rows[0].map(h=>h.trim().toLowerCase()); const required=["date","name","price","calories","protein"];
      const missing=required.filter(h=>!headers.includes(h)); if(missing.length)throw new Error("Missing columns: "+missing.join(", "));
      const imported=[]; let skipped=0;
      for(const cells of rows.slice(1)){if(cells.every(v=>!v.trim()))continue;const obj={};headers.forEach((h,i)=>obj[h]=cells[i]??"");
        const r={id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()),date:obj.date.trim(),name:obj.name.trim(),category:(obj.category||"Other").trim()||"Other",price:number(obj.price),calories:number(obj.calories),protein:number(obj.protein),note:(obj.note||"").trim()};
        if(isValidRecord(r)&&!validateForm(r))imported.push(r);else skipped++;
      }
      if(!imported.length)throw new Error("No valid meal rows found. Check the required columns and values.");
      state.records.push(...imported);saveRecords();render();notify(imported.length+" records imported"+(skipped?", "+skipped+" skipped":"")+".");
    }catch(error){notify(error.message||"Could not read this CSV.");}
    $("csvImport").value="";
  }
  function runPlanner() {
    const budget=number($("dailyBudget").value), targetRaw=$("proteinTarget").value.trim(), target=targetRaw===""?null:number(targetRaw);
    if(!Number.isFinite(budget)||budget<=0){notify("Enter a daily budget greater than ₹0.");$("dailyBudget").focus();return;}
    if(target!==null&&(!Number.isFinite(target)||target<0)){notify("Enter a valid protein target or leave it blank.");return;}
    if(!state.records.length){notify("Add real meal records before running the planner.");return;}
    const affordable=state.records.filter(r=>r.price<=budget).sort((a,b)=>(proteinCost(a)??Infinity)-(proteinCost(b)??Infinity));
    const targetMet=target===null?[]:affordable.filter(r=>r.protein>=target);
    const bestProtein=affordable.slice().sort((a,b)=>b.protein-a.protein)[0];
    const bestValue=affordable.find(r=>r.protein>0);
    const host=$("plannerResults");
    if(!affordable.length){host.innerHTML='<div class="planner-result-head"><h3>Budget analysis</h3><span class="budget-chip">'+money(budget)+'</span></div><div class="planner-empty"><span>↗</span><h3>No recorded meal fits this budget</h3><p>Increase the budget or add lower-priced options from a real menu. No prices have been estimated.</p></div>';return;}
    const options=affordable.slice(0,6);
    host.innerHTML='<div class="planner-result-head"><div><p class="eyebrow">BASED ON YOUR SAVED RECORDS</p><h3>Options within your budget</h3></div><span class="budget-chip">'+money(budget)+' / day</span></div><div class="planner-summary"><div class="planner-stat"><small>Affordable options</small><strong>'+affordable.length+'</strong></div><div class="planner-stat"><small>Highest protein</small><strong>'+formatNumber(bestProtein.protein)+' g</strong></div><div class="planner-stat"><small>Meets protein target</small><strong>'+(target===null?"Not set":targetMet.length)+'</strong></div></div><div class="planner-options">'+options.map(r=>'<div class="planner-option"><div><strong>'+escapeHtml(r.name)+'</strong><small>'+formatNumber(r.protein)+' g protein · '+formatNumber(r.calories,0)+' kcal</small></div><b>'+money(r.price)+'</b></div>').join("")+'</div><p class="planner-note">'+(target===null?"Set an optional protein target to count which individual meal options meet it.":targetMet.length+" of "+affordable.length+" affordable recorded options meet the entered "+formatNumber(target,0)+" g per-meal target.")+' '+(bestValue?"Best protein affordability among affordable options: "+escapeHtml(bestValue.name)+".":"No positive protein values were recorded.")+' These are individual meal comparisons, not a complete daily diet plan.</p>';
  }
  function wireEvents() {
    ["addMealTop","addMealHero","addMealRecords"].forEach(id=>$(id).addEventListener("click",()=>openForm()));
    $("closeForm").addEventListener("click",closeForm);$("cancelForm").addEventListener("click",closeForm);$("mealForm").addEventListener("submit",submitForm);
    $("mealSearch").addEventListener("input",renderTable);
    $("mealTableBody").addEventListener("click",e=>{const btn=e.target.closest("button[data-action]");if(!btn)return;const r=state.records.find(x=>x.id===btn.dataset.id);if(!r)return;if(btn.dataset.action==="edit")openForm(r);if(btn.dataset.action==="delete")deleteRecord(r.id);});
    $("csvExport").addEventListener("click",exportCsv);$("csvImport").addEventListener("change",e=>importCsv(e.target.files[0]));
    $("clearAll").addEventListener("click",()=>{if(!state.records.length)return;if(confirm("Permanently delete all MealMap records saved in this browser? Export a CSV first if you need a backup.")){state.records=[];saveRecords();render();notify("All local records cleared.");}});
    $("runPlanner").addEventListener("click",runPlanner);
    $("mealFormPanel").addEventListener("keydown",e=>{if(e.key==="Escape")closeForm();});
  }
  loadRecords();wireEvents();render();
})();