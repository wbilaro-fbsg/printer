(function(){
  "use strict";

  const questions=[
    {
      name:"Flexibility",
      kicker:"CONTRACT FLEXIBILITY",
      options:[
        "We're locked into a contract that no longer suits how we work.",
        "Changing the number of devices isn't straightforward."
      ]
    },
    {
      name:"Cost visibility",
      kicker:"COST VISIBILITY",
      options:[
        "Our monthly printing costs are difficult to predict.",
        "We sometimes face unexpected print or support charges."
      ]
    },
    {
      name:"Admin workload",
      kicker:"ADMIN WORKLOAD",
      options:[
        "We deal with multiple vendors for devices, supplies and support.",
        "Supply replenishment is mostly manual."
      ]
    },
    {
      name:"IT support",
      kicker:"IT SUPPORT",
      options:[
        "Our internal IT resources are limited.",
        "It takes too long to resolve printer or PC support issues."
      ]
    },
    {
      name:"Office setup",
      kicker:"OFFICE SETUP",
      options:[
        "Our current devices do not always match how our teams work.",
        "We keep more print supplies on hand than we really need."
      ]
    },
    {
      name:"Document security",
      kicker:"DOCUMENT SECURITY",
      options:[
        "Sensitive documents can sit unattended at shared printers.",
        "We have limited visibility or control over print usage."
      ]
    },
    {
      name:"Manual work",
      kicker:"MANUAL WORK",
      options:[
        "Documents still need too much manual organising after scanning.",
        "Information is fragmented across paper, folders or disconnected systems."
      ]
    }
  ];

  const state={
    screen:"intro",
    index:0,
    selected:Array.from({length:questions.length},()=>[false,false]),answered:Array(questions.length).fill(false)
  };

  const intro=document.getElementById("screen-intro");
  const assessment=document.getElementById("screen-assessment");
  const result=document.getElementById("screen-result");
  const questionContent=document.getElementById("question-content");
  const stepCount=document.getElementById("step-count");
  const issueCount=document.getElementById("issue-count");
  const progress=document.getElementById("progress");
  const back=document.getElementById("back-btn");
  const next=document.getElementById("next-btn");

  function issueTotal(){
    return state.selected.flat().filter(Boolean).length;
  }

  function selectedCategories(){
    return questions
      .filter((_,i)=>state.selected[i].some(Boolean))
      .map(q=>q.name);
  }

  function announceScreen(name){
    document.title=name+" | FUJIFILM Business Innovation Singapore";
  }

  function focusHeading(selector){
    requestAnimationFrame(()=>{
      const el=document.querySelector(selector);
      if(!el)return;
      el.setAttribute("tabindex","-1");
      el.focus({preventScroll:true});
    });
  }

  function renderProgress(){
    progress.innerHTML=questions.map((_,i)=>{
      const cls=i<state.index?"done":i===state.index?"current":"";
      return `<span class="${cls}" aria-hidden="true"></span>`;
    }).join("");
  }

  function updateCounter(){
    const n=issueTotal();
    issueCount.textContent=`${n} ${n===1?"issue":"issues"} identified`;
  }

  function showScreen(name){
    intro.hidden=name!=="intro";
    assessment.hidden=name!=="assessment";
    result.hidden=name!=="result";
    state.screen=name;
  }

  function startAssessment(){
    const preview=document.querySelector(".assessment-preview");

    const issueInputs=preview
      ? Array.from(
          preview.querySelectorAll(
            'input[data-preview-option]'
          )
        )
      : [];

    const noneInput=preview
      ? preview.querySelector(
          'input[data-preview-none="true"]'
        )
      : null;

    const selected=
      issueInputs.map(input=>input.checked);

    const answered=
      selected.some(Boolean) ||
      Boolean(noneInput && noneInput.checked);

    if(!answered){
      issueInputs[0]?.focus();
      return;
    }

    state.selected[0]=selected;
    state.answered[0]=true;

    state.index=1;

    showScreen("assessment");
    renderQuestion();

    announceScreen("Business Operations Check");
    focusHeading("#question-title");
  }

  function renderQuestion(){
    const q=questions[state.index];
    stepCount.textContent=String(state.index+1).padStart(2,"0")+" / 07";

    questionContent.innerHTML=`
      <section class="question">
        <p class="question-kicker">${q.kicker}</p>
        <h2 id="question-title">${q.name}</h2>
        <p class="question-intro">Which of these sounds familiar?</p>

        <fieldset class="options">
          <legend class="sr-only">Select all statements that apply</legend>

          ${q.options.map((text,i)=>`
            <label class="option">
              <input
                type="checkbox"
                data-option="${i}"
                ${state.selected[state.index][i]?"checked":""}
                data-track="assessment-answer"
              >
              <span class="check" aria-hidden="true"></span>
              <span class="option-text">${text}</span>
            </label>
          `).join("")}
          <label class="option option-none">
            <input
              type="checkbox"
              data-none="true"
              ${state.answered[state.index] && !state.selected[state.index].some(Boolean)?"checked":""}
            >
            <span class="check" aria-hidden="true"></span>
            <span class="option-text">None of these apply</span>
          </label>
        </fieldset>

        <p class="question-guidance" aria-live="polite">
          ${state.answered[state.index]
            ?"Selection made. You can continue."
            :"Select at least one answer to continue"}
        </p>
      </section>
    `;

    questionContent.querySelectorAll("input").forEach(input=>{
      input.addEventListener("change",()=>{

        const noneInput=
          questionContent.querySelector(
            'input[data-none="true"]'
          );

        if(input.dataset.none==="true"){

          if(input.checked){

            state.selected[state.index]=[
              false,
              false
            ];

            questionContent
              .querySelectorAll(
                "input[data-option]"
              )
              .forEach(issueInput=>{
                issueInput.checked=false;
              });

            state.answered[state.index]=true;

          }else{

            state.answered[state.index]=
              state.selected[state.index]
                .some(Boolean);
          }

        }else{

          const option=
            Number(input.dataset.option);

          state.selected[state.index][option]=
            input.checked;

          if(input.checked && noneInput){
            noneInput.checked=false;
          }

          state.answered[state.index]=
            state.selected[state.index]
              .some(Boolean) ||
            Boolean(
              noneInput &&
              noneInput.checked
            );
        }

        updateCounter();

        const guidance=
          questionContent.querySelector(
            ".question-guidance"
          );

        if(guidance){

          guidance.textContent=
            state.answered[state.index]
              ?"Selection made. You can continue."
              :"Select an answer to continue";

          guidance.classList.toggle(
            "is-ready",
            state.answered[state.index]
          );
        }

        next.disabled=
          !state.answered[state.index];

        next.setAttribute(
          "aria-disabled",
          String(!state.answered[state.index])
        );

      });
    });
    back.style.visibility=state.index===0?"hidden":"visible";
    next.textContent=state.index===questions.length-1?"See my result →":"Next →";

    renderProgress();
    updateCounter();
    next.disabled=!state.answered[state.index];
    next.setAttribute("aria-disabled",String(!state.answered[state.index]));
  }

  function goNext(){
    if(!state.answered[state.index])return;
    if(state.index<questions.length-1){
      state.index++;
      renderQuestion();
      focusHeading("#question-title");
      return;
    }
    renderResult();
  }

  function goBack(){
    if(state.index===0)return;
    state.index--;
    renderQuestion();
    focusHeading("#question-title");
  }

  function outcomeFor(score){
    if(score<=3){
      return {
        band:"0–3 ISSUES",
        title:"Your operations are mostly under control.",
        copy:"Operations appear broadly manageable, but there may still be opportunities to improve cost visibility and your total cost of ownership.",
        cta:"Calculate your potential savings",
        url:"https://campaign-fbsg.fujifilm.com/flexone/hardware#savings"
      };
    }

    if(score<=7){
      return {
        band:"4–7 ISSUES",
        title:"Small inefficiencies are starting to add up.",
        copy:"Several operational friction points may be creating unnecessary cost, administration or support demands.",
        cta:"Compare FleXOne plans",
        url:"https://campaign-fbsg.fujifilm.com/flexone/pricing#comparison"
      };
    }

    return {
      band:"8+ ISSUES",
      title:"Your operations are ready for simplification.",
      copy:"A more consolidated and predictable approach could reduce administrative effort and make printing, supplies and support easier to manage.",
      cta:"Find your FleXOne plan",
      url:"https://campaign-fbsg.fujifilm.com/flexone/home#plan"
    };
  }

  function renderResult(){
    const score=issueTotal();
    const outcome=outcomeFor(score);
    const priorities=selectedCategories();

    let scoreState;

    if(score<=3){
      scoreState={
        key:"good",
        label:"LOOKING GOOD",
        icon:"check",
        headline:"Your operations are in good shape.",
        action:"There is still room to make costs and support more predictable."
      };
    }else if(score<=7){
      scoreState={
        key:"watch",
        label:"WORTH IMPROVING",
        icon:"arrow",
        headline:"Small inefficiencies are adding up.",
        action:"A more structured print plan could remove unnecessary friction."
      };
    }else if(score<=10){
      scoreState={
        key:"action",
        label:"ACTION RECOMMENDED",
        icon:"alert",
        headline:"There is a clear opportunity to simplify.",
        action:"Your assessment points to several areas where FleXOne could reduce operational effort."
      };
    }else{
      scoreState={
        key:"high",
        label:"HIGH OPERATIONAL FRICTION",
        icon:"alert",
        headline:"Time to simplify.",
        action:"Multiple friction points are affecting everyday print operations."
      };
    }

    const maxScore=questions.length*2;
    const scorePercent=Math.max(
      0,
      Math.min(100,Math.round((score/maxScore)*100))
    );

    const topPriorities=priorities.slice(0,3);

    const iconMarkup=
      scoreState.icon==="check"
        ? '<span class="score-icon-mark score-icon-check" aria-hidden="true"></span>'
        : scoreState.icon==="arrow"
          ? '<span class="score-icon-mark score-icon-arrow" aria-hidden="true">↗</span>'
          : '<span class="score-icon-mark score-icon-alert" aria-hidden="true">!</span>';

    showScreen("result");

    result.innerHTML=`
      <div class="result scorecard scorecard-${scoreState.key}">

        <div class="scorecard-meter">

          <div class="scorecard-topline">
            <div class="score-status-icon">
              ${iconMarkup}
            </div>

            <div>
              <p class="score-status">${scoreState.label}</p>
              <p class="score-fraction">
                <strong>${score}</strong>
                <span>/ ${maxScore}</span>
              </p>
            </div>
          </div>

          <div
            class="score-bar"
            role="img"
            aria-label="${score} of ${maxScore} operational issues identified"
          >
            <span style="width:${scorePercent}%"></span>
          </div>

          <div class="score-scale" aria-hidden="true">
            <span>LOW</span>
            <span>MODERATE</span>
            <span>HIGH</span>
          </div>
        </div>

        <div class="result-copy">

          <p class="result-eyebrow">
            YOUR PERSONALISED RESULT
          </p>

          <h2 id="result-title">
            ${scoreState.headline}
          </h2>

          <p class="result-lead">
            ${scoreState.action}
          </p>

          ${
            topPriorities.length
              ? `
                <div class="result-priorities">
                  <p class="priority-label">
                    YOUR BIGGEST OPPORTUNITIES
                  </p>

                  <div class="priority-chips">
                    ${topPriorities
                      .map(x=>`<span>${x}</span>`)
                      .join("")}
                  </div>
                </div>
              `
              : ""
          }

          <div class="result-actions">
            <a
              class="primary-btn result-primary"
              href="${outcome.url}"
              data-track="assessment-result-cta"
            >
              ${outcome.cta} →
            </a>

            <button
              id="retake-btn"
              class="text-btn"
              type="button"
              data-track="assessment-retake"
            >
              Retake assessment
            </button>
          </div>

        </div>
      </div>
    `;

    document
      .getElementById("retake-btn")
      .addEventListener("click",resetAssessment);

    announceScreen("Your FleXOne Recommendation");
    focusHeading("#result-title");
  }

  function resetAssessment(){
    state.index=0;
    state.selected=Array.from({length:questions.length},()=>[false,false]);
      state.answered=Array(questions.length).fill(false);
      document.querySelectorAll(".assessment-preview input[data-preview-option]").forEach(input=>{
        input.checked=false;
      });
    showScreen("intro");
    announceScreen("What Should Your Operations Improve Next?");
    requestAnimationFrame(()=>document.getElementById("start-btn").focus());
  }

    const introStart=document.getElementById("start-btn");
  const introPreview=document.querySelector(".assessment-preview");
  const introInputs=introPreview
    ? Array.from(introPreview.querySelectorAll('input[type="checkbox"]')).slice(0,2)
    : [];

  if(introStart && introInputs.length===2){
    let hint=introPreview.querySelector(".start-selection-hint");

    if(!hint){
      hint=document.createElement("p");
      hint.className="start-selection-hint";
      hint.textContent="Select at least one answer to continue";
      introStart.insertAdjacentElement("beforebegin",hint);
    }

    function updateIntroStart(){
      const answered=introInputs.some(input=>input.checked);

      introStart.disabled=!answered;
      introStart.setAttribute("aria-disabled",String(!answered));
    }

    introInputs.forEach(input=>{
      input.addEventListener("change",updateIntroStart);
    });

    updateIntroStart();
  }

  const step1Preview=document.querySelector(".assessment-preview");
const step1Start=document.getElementById("start-btn");

if(step1Preview && step1Start){

  const step1Issues=Array.from(
    step1Preview.querySelectorAll(
      'input[data-preview-option]'
    )
  );

  const step1None=
    step1Preview.querySelector(
      'input[data-preview-none="true"]'
    );

  function syncStep1(){

    const answered=
      step1Issues.some(input=>input.checked) ||
      Boolean(step1None && step1None.checked);

    step1Start.disabled=!answered;

    step1Start.setAttribute(
      "aria-disabled",
      String(!answered)
    );

    const hint=
      step1Preview.querySelector(
        ".start-selection-hint"
      );

    if(hint){
      hint.textContent=answered
        ?"Selection made. You can continue."
        :"Select an answer to continue";

      hint.classList.toggle(
        "is-ready",
        answered
      );
    }
  }

  step1Issues.forEach(input=>{
    input.addEventListener("change",()=>{

      if(input.checked && step1None){
        step1None.checked=false;
      }

      syncStep1();
    });
  });

  if(step1None){
    step1None.addEventListener("change",()=>{

      if(step1None.checked){
        step1Issues.forEach(input=>{
          input.checked=false;
        });
      }

      syncStep1();
    });
  }

  syncStep1();
}
document.getElementById("start-btn").addEventListener("click",startAssessment);
  next.addEventListener("click",goNext);
  back.addEventListener("click",goBack);

  renderProgress();
})();









