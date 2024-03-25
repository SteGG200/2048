const grid_zero = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

map_color = {
	"2": "#498C6F",
	"4": "#D53856",
	"8": "#50633D",
	"16": "#4186BB",
	"32": "#B98CED",
	"64": "#DC3ED1",
	"128": "#DD961D",
	"256": "#1C8D6C",
	"512": "#995774",
	"1024": "#A0CB4A",
	"2048": "#59D985",
	"4096": "#1B537F",
	"8192": "#FECF8F",
	"16384": "#D133C6",
	"32768": "#492684",
	"65536": "#6A215A",
};

let continue_game = false;

const scenario = [
	[8, 2, 16, 8],	
	[2, 16, 4, 0],
	[16, 8, 0, 2],
	[4, 2, 4, 0]
];

const sidelen = 4;

let grid = grid_zero;
console.log(grid);

function spawn_random(m_grid) {
	vacant_tiles = [];
	for (let i = 0; i < sidelen; i++) {
		for (let j = 0; j < sidelen; j++) {
			if (m_grid[i][j]) continue;
			vacant_tiles.push([i, j]);
		}
	}
	let random_number = Math.floor(Math.random() * 10);
	let random_idx = vacant_tiles[Math.floor(Math.random() * vacant_tiles.length)];
	m_grid[random_idx[0]][random_idx[1]] = (random_number == 0) * 2 + 2;
}

function display_on_board(m_grid) {
	for (let i = 0; i < sidelen; i++) {
		for (let j = 0; j < sidelen; j++) {
			if (m_grid[i][j]) {
				document.getElementById("tile-" + (i + 1) + "-" + (j + 1)).innerHTML = grid[i][j];
				document.getElementById("tile-" + (i + 1) + "-" + (j + 1)).style.backgroundColor = map_color[grid[i][j]];
			} else {
				document.getElementById("tile-" + (i + 1) + "-" + (j + 1)).innerHTML = "";
				document.getElementById("tile-" + (i + 1) + "-" + (j + 1)).style.backgroundColor = "yellow";
			}
		}
	}
}

// left

function push_left(m_grid) {
	for (let i = 0; i < sidelen; i++) {
		row = [];
		for (let j = 0; j < sidelen; j++) {
			if (m_grid[i][j] != 0) row.push(m_grid[i][j]);
			m_grid[i][j] = 0;
		}
		for (let j = 0; j < row.length; j++) {
			m_grid[i][j] = row[j];
		}
	}
}

function combine_left(m_grid) {
	for (let i = 0; i < sidelen; i++) {
		for (let j = 0; j < sidelen - 1; j++) {
			if (m_grid[i][j] == m_grid[i][j + 1] && m_grid[i][j]) {
				m_grid[i][j] *= 2;
				m_grid[i][j + 1] = 0;
			}
		}
	}
}

// right

function push_right(m_grid) {
	for (let i = 0; i < sidelen; i++) {
		row = [];
		for (let j = sidelen - 1; j >= 0; j--) {
			if (m_grid[i][j] != 0) row.push(m_grid[i][j]);
			m_grid[i][j] = 0;
		}
		for (let j = sidelen - 1; j >= sidelen - row.length; j--) {
			m_grid[i][j] = row[sidelen - j - 1];
		}
	}
}
function combine_right(m_grid) {
	for (let i = 0; i < sidelen; i++) {
		for (let j = sidelen - 1; j >= 1; j--) {
			if (m_grid[i][j] == m_grid[i][j - 1] && m_grid[i][j]) {
				m_grid[i][j] *= 2;
				m_grid[i][j - 1] = 0;
			}
		}
	}
}

// down



function push_up(m_grid) {
	for (let j = 0; j < sidelen; j++) {
		col = [];
		for (let i = 0; i < sidelen; i++) {
			if (m_grid[i][j] != 0) col.push(m_grid[i][j]);
			m_grid[i][j] = 0;
		}
		for (let i = 0; i < col.length; i++) {
			m_grid[i][j] = col[i];
		}
	}
}

function combine_up(m_grid) {
	for (let i = 0; i < sidelen - 1; i++) {
		for (let j = 0; j < sidelen; j++) {
			if (m_grid[i][j] == m_grid[i + 1][j] && m_grid[i][j]) {
				m_grid[i][j] *= 2;
				m_grid[i + 1][j] = 0;
			}
		}
	}
}


// down

function push_down(m_grid) {
	for (let j = 0; j < sidelen; j++) {
		col = [];
		for (let i = sidelen - 1; i >= 0; i--) {
			if (m_grid[i][j] != 0) col.push(m_grid[i][j]);
			m_grid[i][j] = 0;
		}
		for (let i = sidelen - 1; i >= sidelen- col.length; i--) {
			m_grid[i][j] = col[sidelen - 1 - i];
		}
	}
}

function combine_down(m_grid) {
	for (let i = sidelen - 1; i >= 1; i--) {
		for (let j = 0; j < sidelen; j++) {
			if (m_grid[i][j] == m_grid[i - 1][j] && m_grid[i][j]) {
				m_grid[i][j] *= 2;
				m_grid[i - 1][j] = 0;
			}
		}
	}
}


function reset_board(m_grid){
	for (let i = 0; i < sidelen; i++){
		for (let j = 0; j < sidelen; j++){
			m_grid[i][j] = 0;
		}
	}
	spawn_random(m_grid);
	spawn_random(m_grid);
}

function check_win(m_grid){
	let has_2048 = false;
	let can_play = false;
	for (let i = 0; i < sidelen; i++){
		for (let j = 0; j < sidelen; j++){
			if (m_grid[i][j] == 2048) has_2048 = true;
			if (m_grid[i][j] == 0) can_play = true;
			if (i > 0 && m_grid[i][j] == m_grid[i - 1][j]) can_play = true;
			if (j > 0 && m_grid[i][j] == m_grid[i][j - 1]) can_play = true;
			if (i < sidelen - 1 && m_grid[i + 1][j] == m_grid[i][j]) can_play = true;
			if (j < sidelen - 1 && m_grid[i][j + 1] == m_grid[i][j]) can_play = true;

		}
	}
	if (has_2048 && !can_play){
		if (confirm("YOU WON! But there are no moves left! Click OK to restart") == true){
			reset_board(m_grid);
			continue_game = false;
		}
		return true;
	}else if (has_2048 && !continue_game){
		if (confirm("YOU WON! Click OK to restart, Click cancel to continue") == true){
			reset_board(m_grid);
		}else{
			continue_game = true;
		}
		return true;
	}else if (!can_play){
		if (confirm("GAME OVER! Click OK to restart") == true){
			reset_board(m_grid);
			continue_game= false;
		}
		return true;
	}
}

grid = grid_zero;
spawn_random(grid);
spawn_random(grid);
//grid = scenario;
display_on_board(grid);
document.addEventListener("keydown", function (event) {
	let ok = false;

	let origin_grid = []

	for(let i = 0; i < sidelen; i++){
		let temp = []
		for(let j = 0; j < sidelen; j++){
			temp.push(grid[i][j])
		}
		origin_grid.push(temp)
	}

	switch (event.key) {
		case 'ArrowLeft':
			push_left(grid);
			combine_left(grid);
			push_left(grid);
			ok = true;
			break;
		case 'ArrowRight':
			push_right(grid);
			combine_right(grid);
			push_right(grid);
			ok = true;
			break;
		case 'ArrowUp':
			push_up(grid);
			combine_up(grid);
			push_up(grid);
			ok = true;
			break;
		case 'ArrowDown':
			push_down(grid);
			combine_down(grid);
			push_down(grid);
			ok = true;
			break;
	}
	// event.preventDefault();
	if (!ok) return;

	if (check_win(grid)){
		display_on_board(grid);
		return;
	}

	let check_is_grid_changed = false

	for(let i = 0; i < sidelen; i++){
		for(let j = 0; j < sidelen; j++){
			if (grid[i][j]!= origin_grid[i][j]){
        check_is_grid_changed = true;
        break;
      }
		}
	}

	if(check_is_grid_changed){
		spawn_random(grid);
		display_on_board(grid);
	}
});
