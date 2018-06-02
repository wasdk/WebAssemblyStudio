static mut module_instance: *mut ArcModule = 0 as *mut ArcModule;

mod color;
mod arc_module;
mod utils;

use color::Rgb;
use arc_module::ArcModule;

pub use utils::init;
pub use utils::getAnimationBuffer;

// Original font.c at https://opengameart.org/sites/default/files/font_0.zip
// Copyright (C) Lisa Milne 2014 <lisa@ltmnet.com>
// License: GPL <http://www.gnu.org/licenses/>
pub const FONT : [u64; 128] = [
    0x7E7E7E7E7E7E0000,	/* NUL */ 0x7E7E7E7E7E7E0000,	/* SOH */ 0x7E7E7E7E7E7E0000,	/* STX */ 0x7E7E7E7E7E7E0000,	/* ETX */ 0x7E7E7E7E7E7E0000,	/* EOT */ 0x7E7E7E7E7E7E0000,	/* ENQ */ 0x7E7E7E7E7E7E0000,	/* ACK */ 0x7E7E7E7E7E7E0000,	/* BEL */ 0x7E7E7E7E7E7E0000,	/* BS */ 0x0,			/* TAB */ 0x7E7E7E7E7E7E0000,	/* LF */ 0x7E7E7E7E7E7E0000,	/* VT */ 0x7E7E7E7E7E7E0000,	/* FF */ 0x7E7E7E7E7E7E0000,	/* CR */ 0x7E7E7E7E7E7E0000,	/* SO */ 0x7E7E7E7E7E7E0000,	/* SI */ 0x7E7E7E7E7E7E0000,	/* DLE */ 0x7E7E7E7E7E7E0000,	/* DC1 */ 0x7E7E7E7E7E7E0000,	/* DC2 */ 0x7E7E7E7E7E7E0000,	/* DC3 */ 0x7E7E7E7E7E7E0000,	/* DC4 */ 0x7E7E7E7E7E7E0000,	/* NAK */ 0x7E7E7E7E7E7E0000,	/* SYN */ 0x7E7E7E7E7E7E0000,	/* ETB */ 0x7E7E7E7E7E7E0000,	/* CAN */ 0x7E7E7E7E7E7E0000,	/* EM */ 0x7E7E7E7E7E7E0000,	/* SUB */ 0x7E7E7E7E7E7E0000,	/* ESC */ 0x7E7E7E7E7E7E0000,	/* FS */ 0x7E7E7E7E7E7E0000,	/* GS */ 0x7E7E7E7E7E7E0000,	/* RS */ 0x7E7E7E7E7E7E0000,	/* US */ 0x0,			/* (space) */ 0x808080800080000,	/* ! */ 0x2828000000000000,	/* " */ 0x287C287C280000,	/* # */ 0x81E281C0A3C0800,	/* $ */ 0x6094681629060000,	/* % */ 0x1C20201926190000,	/* & */ 0x808000000000000,	/* ' */ 0x810202010080000,	/* ( */ 0x1008040408100000,	/* ) */ 0x2A1C3E1C2A000000,	/* * */ 0x8083E08080000,	/* + */ 0x81000,		/* , */ 0x3C00000000,		/* - */ 0x80000,		/* . */ 0x204081020400000,	/* / */ 0x1824424224180000,	/* 0 */ 0x8180808081C0000,	/* 1 */ 0x3C420418207E0000,	/* 2 */ 0x3C420418423C0000,	/* 3 */ 0x81828487C080000,	/* 4 */ 0x7E407C02423C0000,	/* 5 */ 0x3C407C42423C0000,	/* 6 */ 0x7E04081020400000,	/* 7 */ 0x3C423C42423C0000,	/* 8 */ 0x3C42423E023C0000,	/* 9 */ 0x80000080000,		/* : */ 0x80000081000,		/* ; */ 0x6186018060000,	/* < */ 0x7E007E000000,		/* = */ 0x60180618600000,	/* > */ 0x3844041800100000,	/* ? */
    0x3C449C945C201C,	/* @ */ 0x1818243C42420000,	/* A */ 0x7844784444780000,	/* B */ 0x3844808044380000,	/* C */ 0x7844444444780000,	/* D */ 0x7C407840407C0000,	/* E */ 0x7C40784040400000,	/* F */ 0x3844809C44380000,	/* G */ 0x42427E4242420000,	/* H */ 0x3E080808083E0000,	/* I */ 0x1C04040444380000,	/* J */ 0x4448507048440000,	/* K */ 0x40404040407E0000,	/* L */ 0x4163554941410000,	/* M */ 0x4262524A46420000,	/* N */ 0x1C222222221C0000,	/* O */ 0x7844784040400000,	/* P */ 0x1C222222221C0200,	/* Q */ 0x7844785048440000,	/* R */ 0x1C22100C221C0000,	/* S */ 0x7F08080808080000,	/* T */ 0x42424242423C0000,	/* U */ 0x8142422424180000,	/* V */ 0x4141495563410000,	/* W */ 0x4224181824420000,	/* X */ 0x4122140808080000,	/* Y */ 0x7E040810207E0000,	/* Z */ 0x3820202020380000,	/* [ */ 0x4020100804020000,	/* \ */ 0x3808080808380000,	/* ] */ 0x1028000000000000,	/* ^ */ 0x7E0000,		/* _ */ 0x1008000000000000,	/* ` */ 0x3C023E463A0000,	/* a */ 0x40407C42625C0000,	/* b */ 0x1C20201C0000,		/* c */ 0x2023E42463A0000,	/* d */ 0x3C427E403C0000,	/* e */ 0x18103810100000,	/* f */ 0x344C44340438,		/* g */ 0x2020382424240000,	/* h */ 0x800080808080000,	/* i */ 0x800180808080870,	/* j */ 0x20202428302C0000,	/* k */ 0x1010101010180000,	/* l */ 0x665A42420000,		/* m */ 0x2E3222220000,		/* n */ 0x3C42423C0000,		/* o */ 0x5C62427C4040,		/* p */ 0x3A46423E0202,		/* q */ 0x2C3220200000,		/* r */ 0x1C201804380000,	/* s */ 0x103C1010180000,	/* t */ 0x2222261A0000,		/* u */ 0x424224180000,		/* v */ 0x81815A660000,		/* w */ 0x422418660000,		/* x */ 0x422214081060,		/* y */ 0x3C08103C0000,		/* z */ 0x1C103030101C0000,	/* { */ 0x808080808080800,	/* | */ 0x38080C0C08380000,	/* } */ 0x324C000000,		/* ~ */ 0x7E7E7E7E7E7E0000	/* DEL */
    ];

fn cols() -> usize {
    ArcModule::get_instance().cols
}

fn rows() -> usize {
    ArcModule::get_instance().rows
}

fn pos(x: usize, y: usize) -> usize {
    //y * cols() + x
    x * cols() + y
}

fn add_char_trimmed(posx: isize, posy: usize, c: u8, buf: &mut [Rgb]) {
    let mut char_data = FONT[c as usize];

    for y in (posy..(posy+8)) {
        for x in (posx..(posx+8)).rev() {
            let xu = x as usize;
            let bit = char_data & 0x1;
            char_data = char_data >> 1;

            // trim it outside of the viewport
            if x < 0 || xu >= cols() || y >= rows() { continue; }

            if bit == 1 {
                buf[pos(xu, y)] = Rgb::new(0, 0, 0);
            } else {
                buf[pos(xu, y)] = Rgb::new(255, 255, 255);
            }
        }
    }
}

fn add_char_flipped(posx: isize, posy: usize, c: u8, buf: &mut [Rgb]) {
    let mut char_data = FONT[c as usize];

    for y in (posy..(posy+8)).rev() {
        for x in (posx..(posx+8)) {
            let xu = x as usize;
            let bit = char_data & 0x1;
            char_data = char_data >> 1;

            // trim it outside of the viewport
            if x < 0 || xu >= cols() || y >= rows() { continue; }

            if bit == 1 {
                buf[pos(xu, y)] = Rgb::new(0, 0, 0);
            } else {
                buf[pos(xu, y)] = Rgb::new(255, 255, 255);
            }
        }
    }
}

fn add_string_trimmed(mut posx: isize, mut posy: usize, msg: &str, buf: &mut [Rgb]) {
    if !msg.is_ascii() { return; } // no non-ascii support

    for c in msg.bytes() {
        add_char_trimmed(posx, posy, c, buf);
        posx += 8;
        if posx > 0 && posx as usize >= cols() { return; }
    }
}
fn add_string_flipped(mut posx: isize, mut posy: usize, msg: &str, buf: &mut [Rgb]) {
    if !msg.is_ascii() { return; } // no non-ascii support

    for c in msg.bytes().rev() {
        add_char_flipped(posx, posy, c, buf);
        posx += 8;
        if posx > 0 && posx as usize >= cols() { return; }
    }
}

fn clear(buf: &mut [Rgb], color: Rgb) {
    for c in buf {
        *c = color;
    }
}

#[no_mangle]
pub extern fn apply() {
    let mut module = ArcModule::get_instance();
    let cols = module.rows;
    let rows = module.cols;
    let ref mut animation = module.get_animation().as_mut_slice();
    clear(animation, Rgb::new(255, 255, 255));
    let mut offset = 0;
    for (index, frame) in animation.chunks_mut(rows * cols).enumerate() {
        add_string_trimmed(cols as isize - offset, 0, "moz://a", frame);
        add_string_flipped(-(8*8) + offset, rows-8, "JSConfEU", frame);
        if index%2 == 0 {
          offset += 1;
        }

    }
}