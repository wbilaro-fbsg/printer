(function(){
  "use strict";

  const questions=[
    {
      name:"Flexibility",
      kicker:"CONTRACT FLEXIBILITY",
      options:[
        "Our long-term contract no longer fits our business needs",
        "Changing the number of devices means renegotiating or waiting"
      ]
    },
    {
      name:"Cost visibility",
      kicker:"COST VISIBILITY",
      options:[
        "We don't have a clear view of our monthly printing costs",
        "Toner, colour printing and service add unexpected costs"
      ]
    },
    {
      name:"Admin workload",
      kicker:"ADMIN WORKLOAD",
      options:[
        "We manage different vendors for printers, supplies and repairs",
        "Someone must manually monitor and replenish supplies"
      ]
    },
    {
      name:"IT support",
      kicker:"IT SUPPORT",
      options:[
        "We don't have dedicated IT support, or our IT team is stretched",
        "Getting help with device issues takes longer than expected"
      ]
    },
    {
      name:"Office setup",
      kicker:"OFFICE SETUP",
      options:[
        "Our current device doesn't fully match our print needs",
        "We store extra paper and toner in case supplies run out"
      ]
    },
    {
      name:"Document security",
      kicker:"DOCUMENT SECURITY",
      options:[
        "Sensitive documents may be left unattended at the device",
        "We have limited visibility of print, scan and document access"
      ]
    },
    {
      name:"Manual work",
      kicker:"MANUAL WORK",
      options:[
        "We manually name, organise and store scanned documents",
        "Information is scattered across documents, inboxes and spreadsheets"
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

  /* gauge-dom-placement-final */
  const assessmentGauge=document.getElementById("assessment-gauge");
  const questionStage=document.querySelector("#screen-assessment .question-stage");

  if(assessment && assessmentGauge && questionStage){
    assessment.insertBefore(assessmentGauge,questionStage);
  }
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
      const fill=i<state.index ? 100 : 0;
      const status=i<state.index?"done":i===state.index?"current":"";
      return `<span class="${status}" aria-hidden="true"><b>${i+1}</b><em>${questions[i].name}</em><i style="--fill:${fill}%"></i></span>`;
    }).join("");

    const current=progress.querySelector("span.current i");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(current){
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          current.style.setProperty("--fill","100%");
        });
      });
    }
  }

  function updateCounter(){
    const n=state.selected.slice(0,state.index+1).flat().filter(Boolean).length;

    if(assessment){
      const bgState=n>=8 ? "high" : n>=4 ? "watch" : "good";
      assessment.dataset.bgState=bgState;
    }
    const gauge=document.getElementById("assessment-gauge");
    if(!gauge)return;
    const angle=-55+(Math.max(0,Math.min(n,14))/14)*110;
    gauge.style.setProperty("--needle", angle + "deg");
  }

  function showScreen(name){
    const screens={intro,assessment,result};
    const current=screens[state.screen];
    const nextScreen=screens[name];
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced || !current || current===nextScreen){
      intro.hidden=name!=="intro";
      assessment.hidden=name!=="assessment";
      result.hidden=name!=="result";
      state.screen=name;
      return;
    }

    current.classList.add("screen-leaving");

    setTimeout(()=>{
      intro.hidden=name!=="intro";
      assessment.hidden=name!=="assessment";
      result.hidden=name!=="result";

      current.classList.remove("screen-leaving");
      nextScreen.classList.add("screen-entering");
      state.screen=name;

      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          nextScreen.classList.remove("screen-entering");
        });
      });
    },140);
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
    const q=questions[state.index]; assessment.dataset.step=String(state.index+1);

    const stage=document.querySelector("#screen-assessment .question-stage");
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(stage && !reduced){
      stage.classList.remove("question-settle");
      void stage.offsetWidth;
      stage.classList.add("question-settle");

      setTimeout(()=>{
        stage.classList.remove("question-settle");
      },180);
    }
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
            ?"Ready to continue"
            :"Select an answer to continue"}
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
              ?"Ready to continue"
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
        key:"good",
        icon:"😌",
        label:"Mostly under control",
        headline:"Mostly under control.",
        copy:"Small costs can be easy to miss, so flexible plans as short as 12 months are worth considering before your next printer renewal or upgrade.",
        cta:"See Your True Office Cost",
        url:"https://campaign-fbsg.fujifilm.com/flexone/hardware#savings"
      };
    }

    if(score<=7){
      return {
        key:"watch",
        icon:"🤔",
        label:"Quietly adding up",
        headline:"Quietly adding up.",
        copy:"The costs are there, just spread across vendors, bills and your team's time. One consolidated plan could free up budget and hours.",
        cta:"Compare FleXOne Plans",
        url:"https://campaign-fbsg.fujifilm.com/flexone/pricing"
      };
    }

    return {
      key:"action",
      icon:"⚠️",
      label:"Time to simplify",
      headline:"Time to simplify.",
      copy:"Your office is working harder than it should. Multiple vendors, higher bills and more to manage. A predictable monthly fee, scheduled supplies and support can lighten the load.",
      cta:"Find Your FleXOne Plan",
      url:"https://campaign-fbsg.fujifilm.com/flexone/pricing"
    };
  }
  function renderResult(){
    const score=issueTotal();
    const outcome=outcomeFor(score);
    const priorities=selectedCategories();
    const topPriorities=[...priorities,...questions.map(q=>q.name).filter(name=>!priorities.includes(name))].slice(0,3);
    showScreen("result"); document.getElementById("screen-result").style.setProperty("--result-top",document.getElementById("screen-result").getBoundingClientRect().top+"px");
    result.innerHTML=`
      <div class="result scorecard scorecard-${outcome.key}">
        <div class="scorecard-meter result-state-panel">
          <div class="scorecard-topline">
            <div class="score-status-icon result-emoticon" aria-hidden="true">${outcome.icon}</div>
            <div class="severity-copy"><p class="score-status">${outcome.label}</p><p class="severity-kicker">Operational friction</p><div class="severity-meter" style="--gauge:${Math.round((score/(questions.length*2))*100)}%" aria-label="${outcome.label}"></div><div class="severity-scale"><small>Low</small><small>Moderate</small><small>High</small></div></div>
          </div>
        </div>
        <div class="result-copy">
          <p class="result-eyebrow">Your assessment result</p>
          <h2 id="result-title">${outcome.headline}</h2>
          <p class="result-lead">${outcome.copy}</p>
          ${topPriorities.length ? `<div class="result-priorities"><p class="priority-label">YOUR PRIORITIES</p><div class="priority-chips">${topPriorities.map(x=>`<span>${x}</span>`).join("")}</div></div>` : ""}
          <div class="result-actions">
            <a class="primary-btn result-primary" href="${outcome.url}" target="_blank" rel="noopener noreferrer" data-track="assessment-result-cta">${outcome.cta} →</a>
            <button id="retake-btn" class="text-btn" type="button" data-track="assessment-retake">Retake</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("retake-btn").addEventListener("click",resetAssessment);

    /* Value-driven result gauge pointer */
    const resultMeter=result.querySelector(".severity-meter");
    if(resultMeter){
      const target=Math.round((score/(questions.length*2))*100);
      const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      resultMeter.style.setProperty("--pointer","0%");

      if(reduced){
        resultMeter.style.setProperty("--pointer",target+"%");
      }else{
        setTimeout(()=>{
          requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
              resultMeter.style.setProperty("--pointer",target+"%");
            });
          });
        },220);
      }
    }
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
    announceScreen("What Should Your Business Fix Before It Costs More?");
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
      hint.textContent="Select an answer to continue";
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
        ?"Ready to continue"
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




