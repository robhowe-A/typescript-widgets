

const linkswidget = () => {
	// global variables
// Make the DIV element draggable:
	let allLinks = document.querySelectorAll(".showSpace a[data-arrayList-type=\"link\"]") as NodeListOf<HTMLAnchorElement>;
	let allBoxes = document.querySelectorAll(".showSpace div[data-arrayList-type=\"box\"]") as NodeListOf<HTMLElement>;
	let currentDroppable: HTMLElement;
	let movingObject: HTMLElement;
	// Add box dataset attributes
	for (let i=0; i<allBoxes.length;i++){
		// Add box number to dataset
		allBoxes[i].setAttribute("data-arrayList-boxnumber", `${i+1}`);
	
		// Check box has only one link, fill attribute
		if (allBoxes[i].querySelectorAll("a").length == 1){
			allBoxes[i].setAttribute("filled", "true");
		}
	}
	// Add link dataset attributes
	for (let i=0;i<allLinks.length;i++){
		//add link number to dataset
		allLinks[i].setAttribute("data-arrayList-linknumber", `${i+1}`);
	}
	// Create box coordinates array, add box number to dataset
	let allBoxesCoordinates: any[] = [];
	let createBoxCoordinates = () => {
		for (let i=0; i<allBoxes.length;i++){
		// Create box object
			let box:any = {
				name: `box${i}`,
				boxNumber: i,
				centerX: allBoxes[i].getBoundingClientRect().left + (allBoxes[i].getBoundingClientRect().width / 2),
				centerY: allBoxes[i].getBoundingClientRect().top + (allBoxes[i].getBoundingClientRect().height / 2)
			};

			allBoxesCoordinates.push(box);
		}
	};
	// Reset box coordinates when scrolling
	window.onscroll = () => {
		allBoxesCoordinates = [];
		createBoxCoordinates();
	};

	// Update filled attribute if box contains link
	const setBoxFilledAttribute = () => {
		allBoxes.forEach(box => {
			if (box.querySelectorAll("a").length == 0){
				box.setAttribute("filled", "false");
			}
			else if (box.querySelectorAll("a").length > 1){
				box.setAttribute("filled", "overfilled");
			}
			else if (box.querySelectorAll("a").length == 1){
				box.setAttribute("filled", "true");
			}
		
		});
	};

	const moveElementToEmpty = () => {
		let overFilledBox = document.querySelector(".showSpace div[data-arrayList-type=\"box\"][filled=\"overfilled\"]");
		if (overFilledBox == null) return;
		let overFilledOrigLink;
		let overFilledLinks = overFilledBox.querySelectorAll("a[data-arrayList-type=\"link\"]");
	
		//Move link out from overfilled box
		if(overFilledLinks.length > 1) overFilledOrigLink = overFilledLinks[1];
		let falseFilledBox = document.querySelector(".showSpace div[data-arrayList-type=\"box\"][filled=\"false\"]") as HTMLDivElement;
		falseFilledBox.insertAdjacentElement("afterbegin", overFilledOrigLink);

		setBoxFilledAttribute();
	};

	//returns the distance of two points
	let getDistance = (x1:number , y1:number , x2:number , y2: number) => {
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	};

	const dragElement = (draggableElmnt: HTMLElement) => {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

		const dragMouseDown = (e: MouseEvent) => {
			e.preventDefault();
			draggableElmnt.style.position = "absolute";
			movingObject = draggableElmnt;

			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;

			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		};

		draggableElmnt.onmousedown = dragMouseDown;

		const elementDrag = (e: MouseEvent) => {
    
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			console.log(`clientX: ${e.clientX}, clientY: ${e.clientY}`);
			// set the element's new position:
			draggableElmnt.style.top = (draggableElmnt.offsetTop - pos2) + "px";
			draggableElmnt.style.left = (draggableElmnt.offsetLeft - pos1) + "px";
			//get center of draggable element
			let elmntCenterX = draggableElmnt.getBoundingClientRect().left + (draggableElmnt.getBoundingClientRect().width / 2);
			let elmntCenterY = draggableElmnt.getBoundingClientRect().top + (draggableElmnt.getBoundingClientRect().height / 2);
		
			let distancesFromCursorToBoxes: number[] = []; //all box distances from drag location
			for (let box of allBoxesCoordinates){
				distancesFromCursorToBoxes.push(getDistance(box.centerX, box.centerY, elmntCenterX, elmntCenterY));
			}
			//find the closest box by distance
			let lowestDistToBox = Math.min(...distancesFromCursorToBoxes);

			//set the closest box
			let closestBox;
			let closestBoxElem: HTMLElement;

			closestBox = allBoxesCoordinates[distancesFromCursorToBoxes.findIndex(num => num == lowestDistToBox)];
			closestBoxElem = allBoxes[closestBox.boxNumber] as HTMLElement;

			if (currentDroppable != closestBoxElem) {
				if (currentDroppable) { // null when we were not over a droppable before this event
					currentDroppable.style.backgroundColor = "lightblue";
				}
				currentDroppable = closestBoxElem;
				if (currentDroppable) { // null if we're not coming over a droppable now
				// (maybe just left the droppable)
					closestBoxElem.style.backgroundColor = "green";
					closestBoxElem.insertAdjacentElement("afterbegin", draggableElmnt);
					setBoxFilledAttribute();
					moveElementToEmpty();
					closestBox = null;
				}
			}
		};

		function closeDragElement() {
		// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
			movingObject.removeAttribute("style");
		}
	};

	createBoxCoordinates();
	setBoxFilledAttribute();
	allLinks.forEach(link => dragElement(link));
};
// linkswidget();
window.addEventListener("DOMContentLoaded", linkswidget, { once: true });
window.onresize = linkswidget;
