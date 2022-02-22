import React, { FC } from 'react';
import styles from './Accordion.module.scss';
import uuid from 'react-uuid';


// TYPES & INTERFACES
export interface IAccordionElement {
  header?: string;
  details?: string[] | JSX.Element[];
}

export interface AccordionProps {
  title?: string;
  data?: IAccordionElement[],
  children?: React.ReactNode
}

interface IUiState {
  active: number
}

// COMPONENTS
export const Accordion: FC<AccordionProps> = ({ data, title, children }) => {
  const [ui, setUI] = React.useState<IUiState>({ active: -1 })
  
  // KEYDOWN NAVIGATION START
  const contentElement = React.useRef(null)

  const instance = React.useMemo(() => {return uuid()},[])


  React.useEffect(() => {
    const content: HTMLElement = contentElement.current!;

    const triggers = content.querySelectorAll(`.${styles.AccordionTrigger}`);
   
    function keyDownHandler(e: KeyboardEvent){
      if (e.code.match(/ArrowUp|ArrowDown/)) {
        const index = Array.from(triggers).indexOf((e.target as Element));
        const direction = e.code === 'ArrowDown' ? 1 : -1;
        const newIndex = (index + triggers.length + direction) % triggers.length;
        (triggers[newIndex] as HTMLElement).focus();
        e.preventDefault()
      } else if (e.code.match(/Home|End/)) {
        e.code === 'Home' ? 
        (triggers[0] as HTMLElement).focus() :
        (triggers[triggers.length - 1] as HTMLElement).focus()
        e.preventDefault()
      }
    }
    
    content.addEventListener('keydown', keyDownHandler)

    return () => {
      content.removeEventListener('keydown', keyDownHandler)
    }
  },[])
  // KEYDOWN NAVIGATION END


  function toggleActive(e: any) {
    const { value } = e.target
    setUI({
      ...ui,
      active: parseInt(value) === ui.active ? -1 : parseInt(value)
    })
  }

  return (
    <div className={styles.Accordion} data-testid="Accordion">
      {title && <div className={styles.title}><h2>{title}</h2></div>}
      <div ref={contentElement} className={styles.content}>
        {/* DATA OBJECT COMPOSITION */}
        {data && data.map((d, i) =>
          <AccordionDetailsElement key={i} {...{ ui, index: i, data: d, onClick: toggleActive, instance }} />
        )}

        {/* CHILDREN OBJECT COMPOSITION */}
        {React.Children.map(children, (child, i) => 
          <AccordionDetailsElement key={i} {...{ ui, index: i, onClick: toggleActive, instance, children: child }} />
        )}
      </div>
    </div>
  );
}

export default Accordion;


export const AccordionDetailsElement: FC<{ instance: string, ui: IUiState, index: number, children?: React.ReactNode, data?: IAccordionElement, onClick: (e: any) => void }> = ({ instance, ui, index, children, data, onClick }) => {
  
  const header = children && ((children as React.Component).props as {header: string}).header
  
  return (
    <div className={`${styles.AccordionDetailsElement} ${ui.active === index ? styles.active : ''}`}>
      {data?.header && <DetailsHeader {...{ instance, header: data.header, active: ui.active === index, onClick: onClick, index }} />}
      {data?.details && <DetailsPanel {...{ data: data.details, index, instance }} />}
      
      {children && 
      <>
        <DetailsHeader {...{ instance, header: header || 'Expand', active: ui.active === index, onClick: onClick, index }} />
        <DetailsPanel {...{ children, index, instance }} />
      </>}
    </div>)
}


export const DetailsHeader: FC<{ instance: string, header: string, active: boolean, onClick?: (e: any) => void, index?: number }> = ({ header, active, onClick, index, instance }) => {
  return (
    <h3 className={styles.ElementHeader} >
      <button
        aria-expanded={active}
        className={styles.AccordionTrigger}
        value={index}
        aria-controls={`sect${index}-${instance}`}
        id={`accordion${index}id-${instance}`}
        onClick={onClick}>
        <span className={styles.AccordionTitle}>
          {header}
        </span>
        <span className={`${styles.AccordionIcon}`}></span>
      </button>
    </h3>)
}


export const DetailsPanel: FC<{ instance: string, data?: IAccordionElement['details'], index: number, children?: React.ReactNode }> = ({ data, children, index, instance }) => {
  return (
    <div
      id={`sect${index}-${instance}`}
      role="region"
      aria-labelledby={`accordion${index}id-${instance}`}
      className={styles.DetailsPanel}>
      {data && Array.isArray(data) && data.map((s, i) => <p key={i} className={styles.elementParagraph}>{s}</p>)}      
      {data && !Array.isArray(data) && data }
      {children}
    </div>
  )
}
