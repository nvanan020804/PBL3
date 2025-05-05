package PBL3.backend.controller;

import PBL3.backend.model.ThietBi;
import PBL3.backend.service.ThietBiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thietbi")
@CrossOrigin(origins = "*")
public class ThietBiController {

    private final ThietBiService thietBiService;

    @Autowired
    public ThietBiController(ThietBiService thietBiService) {
        this.thietBiService = thietBiService;
    }

    @GetMapping
    public ResponseEntity<List<ThietBi>> getAllThietBi() {
        List<ThietBi> thietBiList = thietBiService.getAllThietBi();
        return new ResponseEntity<>(thietBiList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThietBi> getThietBiById(@PathVariable int id) {
        return thietBiService.getThietBiById(id)
                .map(thietBi -> new ResponseEntity<>(thietBi, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/trangthai/{trangThai}")
    public ResponseEntity<List<ThietBi>> getThietBiByTrangThai(@PathVariable String trangThai) {
        List<ThietBi> thietBiList = thietBiService.getThietBiByTrangThai(trangThai);
        return new ResponseEntity<>(thietBiList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createThietBi(@RequestBody ThietBi thietBi) {
        try {
            ThietBi newThietBi = thietBiService.createThietBi(thietBi);
            return new ResponseEntity<>(newThietBi, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateThietBi(@PathVariable int id, @RequestBody ThietBi thietBiDetails) {
        try {
            ThietBi updatedThietBi = thietBiService.updateThietBi(id, thietBiDetails);
            return new ResponseEntity<>(updatedThietBi, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteThietBi(@PathVariable int id) {
        try {
            thietBiService.deleteThietBi(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/trangthai")
    public ResponseEntity<?> updateTrangThai(@PathVariable int id, @RequestBody Map<String, String> trangThaiMap) {
        try {
            String trangThai = trangThaiMap.get("trangThai");
            if (trangThai == null || trangThai.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Trạng thái không được để trống");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            ThietBi updatedThietBi = thietBiService.updateTrangThaiThietBi(id, trangThai);
            return new ResponseEntity<>(updatedThietBi, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}